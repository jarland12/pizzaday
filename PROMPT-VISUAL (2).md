# BTC Pizza Rush — Prompt de Rediseño Visual
## Binance Pizza Day — Identidad Oficial

## ⚠️ Reglas críticas
- **NO tocar** `server.js` ni la lógica de Socket.IO
- **NO cambiar** IDs ni clases CSS que manejen eventos o fases del juego
- Solo modificar: colores, tipografía, animaciones, layout, efectos visuales
- **NO generar ilustraciones en SVG o CSS** — usar los JPGs de `/public/assets/` directamente
- Mantener toda la funcionalidad existente intacta

---

## Identidad visual del evento — análisis detallado

### Concepto: "Neon Effect — Pizza from a Diner"
El branding replica letreros de neón de pizzería clásica americana reinterpretados en clave crypto. Los elementos clave son:
- Pizza en trazo neón amarillo/dorado con toppings en forma de diamante verde crypto
- Círculo con símbolo ₿ en trazo neón, mismo estilo de trazo que la pizza
- Tipografía bold italic condensada, amarilla, sin espaciado, muy grande
- Fondo siempre negro profundo `#0B0E11`
- Detalles verdes `#2ECC71` solo en toppings y acentos pequeños — nunca como color dominante

### Paleta oficial exacta
```css
--black:    #0B0E11;   /* fondo principal — Black 1000 Pantone Black C */
--yellow:   #F0B90B;   /* amarillo Binance — Yellow 200 Pantone 116 C — COLOR DOMINANTE */
--gold:     #C87D2A;   /* dorado — Yellow 300 Pantone 137 C — acento secundario */
--green:    #2ECC71;   /* verde crypto — Green 100 Pantone 354 C — solo detalles */
```

### Tipografía
- Títulos y textos grandes: `Barlow Condensed` 900 italic — replica exactamente el estilo del branding
- Números y contadores del juego: `Orbitron` 700
- Importar desde Google Fonts CDN

### Jerarquía visual de los templates
Todos los materiales del evento siguen este patrón:
1. Logo `◆ BINANCE` pequeño arriba izquierda en amarillo
2. Título del evento en `Barlow Condensed` 900 italic, amarillo, enorme, lado izquierdo
3. Ilustración neón (pizza o ₿) lado derecho, flotando
4. CTA o info secundaria abajo izquierda
5. Fondo negro sin textura

---

## Assets en /public/assets/
```
key-visual.jpg    ← pizza neón grande inclinada + título "PIZZA DAY" — HERO PRINCIPAL
templates.jpg     ← layouts con pizza neón y círculo ₿ — referencia de composición
materials.jpg     ← banners "SHARE A PIZZA", trophy neón, dos pizzas juntas — referencia
colors.jpg        ← paleta oficial — referencia de colores exactos
```

### Cómo usar los JPGs en el juego
- `key-visual.jpg`: fondo decorativo en lobby y resultados — `opacity: 0.12`, `object-fit: cover`, posicionado a la derecha
- `materials.jpg`: recortar visualmente el panel del trophy neón para la pantalla de ganador — `opacity: 0.15` como fondo
- NO usar `templates.jpg` ni `colors.jpg` en el juego — son solo referencia

---

## Efectos de arcade obligatorios

```css
body::after {
  content: '';
  position: fixed; inset: 0;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

@keyframes neon-flicker {
  0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
  20%,24%,55% { opacity: 0.4; }
}
@keyframes neon-pulse { 0%,100%{box-shadow:0 0 8px #F0B90B,0 0 20px #F0B90B44} 50%{box-shadow:0 0 16px #F0B90B,0 0 40px #F0B90B88} }
@keyframes glitch {
  0%,100%{transform:translate(0)} 20%{transform:translate(-3px,1px)} 40%{transform:translate(3px,-1px)} 60%{transform:translate(-2px,2px)} 80%{transform:translate(2px,-2px)}
}
@keyframes countdown-boom { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
@keyframes confetti-fall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
@keyframes tap-ripple { 0%{transform:scale(0);opacity:0.8} 100%{transform:scale(3);opacity:0} }
@keyframes slot-enter { 0%{transform:translateY(-20px);opacity:0} 100%{transform:translateY(0);opacity:1} }
@keyframes score-pop { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-60px);opacity:0} }
@keyframes float-bg { 0%,100%{transform:scale(1.02) translateY(0)} 50%{transform:scale(1.02) translateY(-10px)} }
@keyframes trophy-pulse { 0%,100%{filter:drop-shadow(0 0 8px #F0B90B)} 50%{filter:drop-shadow(0 0 20px #F0B90B)} }
```

---

## display.html — Pantalla principal (proyector/TV 1920×1080)

### Layout base — todas las vistas
```
┌─────────────────────────────────────────┐
│ ◆ BINANCE                    [timer/fase]│  ← header fijo, fondo #0B0E11
├─────────────────────────────────────────┤
│                                          │
│           CONTENIDO PRINCIPAL            │
│                                          │
├─────────────────────────────────────────┤
│    SHARE A PIZZA, SHARE A BITCOIN        │  ← footer fijo, verde tenue
└─────────────────────────────────────────┘
```

### Vista: waiting (lobby)
Replicar composición de los templates del evento:
- **Izquierda**: 
  - `◆ BINANCE` pequeño arriba
  - `BINANCE` en Barlow Condensed 900 italic, amarillo `#F0B90B`, 80px, con `neon-flicker`
  - `PIZZA DAY` debajo, mismo estilo, 100px
  - `BTC PIZZA RUSH` en dorado `#C87D2A`, 32px, debajo
  - QR con borde 3px sólido amarillo + `neon-pulse`
- **Derecha**:
  - `key-visual.jpg` recortado mostrando la pizza neón, `opacity: 0.7`, `float-bg` animation
  - 4 slots en grid 2×2 superpuestos sobre fondo oscuro semitransparente
  - Slot vacío: borde punteado 2px `#F0B90B44`, texto `INSERT PLAYER` parpadeando, fondo `#111318`
  - Slot ocupado: borde 2px sólido `#F0B90B` + `neon-pulse`, BUID en `#2ECC71` Orbitron, animación `slot-enter`

### Vista: countdown
- Fondo `#0B0E11` con `key-visual.jpg` al 8% de opacidad
- `GET READY` en Barlow Condensed 900 italic, `#C87D2A`, 48px, arriba centrado, parpadeando
- Número gigante centrado, Barlow Condensed 900 italic, `#F0B90B`, 280px
- Glow: `text-shadow: 0 0 20px #F0B90B, 0 0 60px #F0B90B88`
- Animación `countdown-boom` en cada número + `navigator.vibrate` en mobile

### Vista: playing
Grid 2×2 ocupando 90% de la pantalla. Cada card de jugador:
```
┌────────────────────────────┐
│ [COLOR] BUID — #slot       │  ← header con color único del jugador
│                            │
│     🍕  × 8               │  ← contador grande, Orbitron, glow
│                            │
│ ████████░░░░░░░░░░░░░░     │  ← barra de progreso, amarilla con glow
│                            │
│ [BITE! aparece/desaparece] │  ← score-pop al completar pizza
└────────────────────────────┘
```
- Card fondo: `#111318`, borde 2px color del jugador con glow
- Timer global arriba: barra full-width, verde→amarillo→rojo con transición CSS, Orbitron countdown

### Vista: results
- `key-visual.jpg` como fondo al 12%, `float-bg`
- `materials.jpg` recortado en el área del trophy, esquina derecha, `opacity: 0.2`
- `WINNER` gigante centrado, Barlow Condensed 900 italic, 160px, `#F0B90B`, efecto `glitch`
- BUID ganador debajo, Orbitron 700, 64px, `#2ECC71`, glow verde
- Tabla de posiciones: `#1 BUID — N 🍕`, fondo cards `#111318`, borde color jugador
- 40+ divs de confeti: colores alternados `#F0B90B` y `#2ECC71`, `animation: confetti-fall` con delays variados

---

## mobile.html — Pantalla del jugador (375px)

### Layout base
```
┌──────────────────────┐
│ ◆ BINANCE  PIZZA DAY │  ← header fijo, amarillo pequeño
├──────────────────────┤
│                      │
│   CONTENIDO FASE     │
│                      │
└──────────────────────┘
```

### Vista: ingreso BUID
- Fondo `#0B0E11`
- `BINANCE PIZZA DAY` Barlow Condensed 900 italic, amarillo, 48px, centrado, `neon-flicker`
- `BTC PIZZA RUSH` dorado `#C87D2A`, 24px
- 🍕 emoji grande centrado, 80px, bounce animation
- Input: `background: #111318`, `border: 2px solid #F0B90B`, texto blanco, `border-radius: 4px`, padding 16px
- Botón `¡UNIRSE!`: `background: #F0B90B`, texto `#0B0E11`, Barlow Condensed 900, 24px, full-width, `border-radius: 4px`
- Error BUID: texto `#E63946`, shake animation

### Vista: sala de espera
- `WAITING FOR PLAYERS` Orbitron, amarillo, con puntos animados
- Lista de jugadores con BUID en verde `#2ECC71`, `slot-enter`
- Slots vacíos: fondo `#111318`, borde punteado amarillo tenue

### Vista: countdown
- Número gigante full-screen, Barlow Condensed 900 italic, amarillo, glow
- `countdown-boom` + `navigator.vibrate(200)`

### Vista: jugando (TAP)
Toda la pantalla es el área de juego:
- Fondo `#0B0E11`
- **Arriba**: barra de progreso hacia próxima pizza (5 taps), altura 8px, amarilla con glow, animación fluida
- **Arriba**: contador `🍕 × N` Orbitron 700, amarillo, 28px
- **Centro**: botón TAP ocupa 65% de altura de pantalla
  - Borde 4px sólido `#F0B90B` + `neon-pulse`
  - Fondo `#0D1117`
  - 🍕 emoji 72px centrado
  - Texto `¡COMER!` Barlow Condensed 900 italic, `#F0B90B`, 52px
  - Al tap: clase `tapped` que dispara `tap-ripple` (div absoluto amarillo)
  - Flash: `animation: flash 0.1s` que sube opacity del fondo a `#F0B90B22`
- `navigator.vibrate(30)` por tap
- `navigator.vibrate([50,30,50])` al completar pizza
- `score-pop`: `+1 🍕` aparece sobre el botón y sube

### Vista: resultado
- **Ganó**: fondo con destello `#F0B90B22`, `¡GANASTE!` Barlow Condensed gigante amarillo, confeti CSS
- **Perdió**: `BUEN INTENTO` Barlow Condensed, dorado `#C87D2A`
- Pizzas comidas: `🍕 × N` Orbitron grande
- Posición: `#1` / `#2` / `#3` / `#4` con color del jugador

---

## Colores únicos por jugador
```css
--player-1: #F0B90B;  /* amarillo Binance */
--player-2: #2ECC71;  /* verde crypto */
--player-3: #E63946;  /* rojo pizza */
--player-4: #9B5DE5;  /* púrpura */
```

---

## Notas finales para el agente
- `pointer-events: none` en TODOS los elementos decorativos sin excepción
- El confeti son 40 divs `position: fixed`, `width: 8-12px`, `height: 8-12px`, colores `#F0B90B` y `#2ECC71`, `border-radius: 2px`, `animation-delay` de 0 a 3s aleatorio
- Probar que el botón TAP responde sin lag — las animaciones decorativas no deben afectar el rendimiento del tap
- Toda la paleta sale ÚNICAMENTE de: `#0B0E11`, `#F0B90B`, `#C87D2A`, `#2ECC71`
- El verde `#2ECC71` es solo para acentos — nunca como color de fondo ni dominante
- Barlow Condensed 900 italic para TODO lo que sea título o texto de impacto
- Orbitron 700 para TODO lo que sea número, contador o dato del juego
