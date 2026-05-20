# BTC Pizza Rush — Prompt de Sonido
## Mecánicas de Audio — Web Audio API + Assets

## ⚠️ Reglas críticas
- **NO tocar** `server.js` ni la lógica de Socket.IO
- **NO cambiar** IDs ni clases CSS que manejen eventos o fases del juego
- Solo agregar la capa de audio en `mobile.html`, `display.html` y un nuevo `sound.js`
- Mantener toda la funcionalidad existente intacta

---

## Assets de audio en /public/assets/sounds/

```
tap.mp3             ← sonido de mordida/crunch por cada tap
pizza-complete.mp3  ← sonido de recompensa al completar cada pizza (cada 5 taps)
countdown.mp3       ← beep por cada segundo del countdown (3, 2, 1)
game-start.mp3      ← fanfare al iniciar el juego
winner.mp3          ← victoria al mostrar el ganador
join.mp3            ← pop al unirse un jugador al lobby
```

---

## Arquitectura de audio

Crear `/public/sound.js` con toda la lógica de audio. Importar en `mobile.html` y `display.html`.

### Regla crítica de Web Audio API
El navegador bloquea audio hasta que el usuario interactúa con la página.
Solución: crear el `AudioContext` en el primer tap o click del usuario.

```javascript
// Patrón obligatorio
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Llamar en el primer evento de usuario
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });
```

### Sistema de carga de sonidos

```javascript
const sounds = {};

async function loadSound(name, url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    sounds[name] = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (e) {
    console.warn(`Sound ${name} not loaded:`, e);
  }
}

async function loadAllSounds() {
  initAudio();
  await Promise.all([
    loadSound('tap', '/assets/sounds/tap.mp3'),
    loadSound('pizzaComplete', '/assets/sounds/pizza-complete.mp3'),
    loadSound('countdown', '/assets/sounds/countdown.mp3'),
    loadSound('gameStart', '/assets/sounds/game-start.mp3'),
    loadSound('winner', '/assets/sounds/winner.mp3'),
    loadSound('join', '/assets/sounds/join.mp3'),
  ]);
}

function playSound(name, volume = 1.0) {
  if (!audioCtx || !sounds[name]) return;
  const source = audioCtx.createBufferSource();
  const gainNode = audioCtx.createGain();
  source.buffer = sounds[name];
  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start(0);
}
```

---

## Mapeo de sonidos a eventos del juego

### En mobile.html

| Evento Socket / Acción | Sonido | Volumen |
|------------------------|--------|---------|
| Click en botón TAP | `tap` | 0.6 |
| `tap_update` y pizzas aumentó | `pizzaComplete` | 1.0 |
| `countdown` (cada segundo) | `countdown` | 0.8 |
| `game_start` | `gameStart` | 1.0 |
| `game_over` + es ganador | `winner` | 1.0 |

### En display.html

| Evento Socket | Sonido | Volumen |
|---------------|--------|---------|
| `lobby_update` (nuevo jugador) | `join` | 0.7 |
| `countdown` (cada segundo) | `countdown` | 1.0 |
| `game_start` | `gameStart` | 1.0 |
| `game_over` | `winner` | 1.0 |

---

## Comportamiento específico por mecánica

### Tap (mobile)
- Sonido `tap` en CADA tap durante fase `playing`
- Debe ser instantáneo — latencia máxima 50ms
- Si el sonido anterior no terminó, reproducir igual (polyphony)
- Volumen 0.6 para no saturar con taps rápidos

### Pizza completada
- Sonido `pizzaComplete` solo cuando `pizzas` del jugador aumenta en el evento `tap_update`
- Volumen más alto que el tap para que se sienta como recompensa
- En mobile: reproducir junto con la animación `score-pop`

### Countdown
- Sonido `countdown` al recibir cada evento `countdown` del servidor (3, 2, 1)
- En el último segundo (1): subir volumen a 1.0 para más impacto

### Game start
- Sonido `gameStart` al recibir evento `game_start`
- Reproducir una sola vez, volumen máximo

### Winner
- Sonido `winner` al recibir evento `game_over`
- En display: reproducir inmediatamente con el reveal del ganador
- En mobile: reproducir solo si el jugador es el ganador

### Join (solo display)
- Sonido `join` cada vez que `lobby_update` trae un nuevo jugador
- Ayuda al público entender que alguien se unió

---

## Fallback si no hay archivos de audio

Si algún archivo MP3 no carga, el juego debe seguir funcionando sin errores.
El `try/catch` en `loadSound` ya cubre esto — si falla, `sounds[name]` queda undefined
y `playSound` retorna silenciosamente.

Opcional: implementar sonidos de fallback con Web Audio API sintetizada:

```javascript
function playBeep(frequency = 440, duration = 0.1, volume = 0.3) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = frequency;
  osc.type = 'square';
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

// Usar si MP3 no carga:
// tap → playBeep(800, 0.05, 0.2)
// pizzaComplete → playBeep(1200, 0.15, 0.4)
// countdown → playBeep(600, 0.1, 0.3)
// gameStart → playBeep(880, 0.3, 0.5)
// winner → playBeep(1047, 0.5, 0.6)
// join → playBeep(500, 0.08, 0.25)
```

Esto garantiza que si los MP3 fallan, el juego igual tiene feedback sonoro básico.

---

## Implementación en los archivos HTML

### En mobile.html — agregar al final del `<body>`
```html
<script src="/sound.js"></script>
<script>
  // Inicializar audio en primer toque
  document.addEventListener('touchstart', () => {
    loadAllSounds();
  }, { once: true });
</script>
```

### En display.html — agregar al final del `<body>`
```html
<script src="/sound.js"></script>
<script>
  document.addEventListener('click', () => {
    loadAllSounds();
  }, { once: true });
</script>
```

---

## Notas finales para el agente
- Crear `/public/sound.js` como archivo independiente — no inline en el HTML
- El audio NO debe bloquear la carga de la página — usar `async/await` y no esperar a que carguen
- En mobile el tap debe sonar instantáneo — priorizar latencia sobre calidad
- El volumen del tap (0.6) debe ser menor que el de pizza-complete (1.0) para crear jerarquía sonora
- Si `audioCtx.state === 'suspended'`, llamar `audioCtx.resume()` antes de reproducir
- Probar que el sonido de tap no se satura con taps muy rápidos (polyphony nativa de Web Audio API lo maneja)
