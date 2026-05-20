# BTC Pizza Rush — Prompt de Rediseño Visual
## Binance Pizza Day — Identidad Oficial

## ⚠️ Reglas críticas
- **NO tocar** `server.js` ni la lógica de Socket.IO
- **NO cambiar** IDs ni clases CSS que manejen eventos o fases del juego
- Solo modificar: colores, tipografía, animaciones, layout, efectos visuales
- **NO generar ilustraciones en SVG o CSS** — usar los PNGs de `/public/assets/` directamente
- Mantener toda la funcionalidad existente intacta

---

## Assets disponibles en /public/assets/

```
pizza.png    ← dos rebanadas de pizza neón amarillo/verde — elemento principal del juego
bitcoin.png  ← círculo ₿ neón con rebanada de pizza — elemento secundario/decorativo  
trophy.png   ← trofeo neón amarillo con detalles verdes — exclusivo para pantalla de ganador
```

### Reglas de uso de los assets
- Usar siempre con `<img src="/assets/X.png">` — nunca como `background-image`
- Animar con CSS `transform` y `filter` únicamente — nunca mover el src
- `pointer-events: none` siempre en estos elementos
- El fondo negro de los PNGs se integra naturalmente con el fondo `#0B0E11` del juego

### Animaciones permitidas sobre los assets
```css
/* Flotación suave */
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

/* Pulso de glow */
@keyframes glow-pulse {
  0%,100%{filter:drop-shadow(0 0 8px #F0B90B) drop-shadow(0 0 20px #F0B90B44)}
  50%{filter:drop-shadow(0 0 16px #F0B90B) drop-shadow(0 0 40px #F0B90B88)}
}

/* Rotación lenta para bitcoin.png */
@keyframes slow-rotate { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }

/* Celebración trophy */
@keyframes trophy-celebrate {
  0%,100%{transform:scale(1) rotate(0deg)}
  25%{transform:scale(1.05) rotate(-3deg)}
  75%{transform:scale(1.05) rotate(3deg)}
}
```

---

## Paleta oficial exacta
```css
--black:  #0B0E11;  /* fondo principal */
--yellow: #F0B90B;  /* amarillo Binance — COLOR DOMINANTE */
--gold:   #C87D2A;  /* dorado — acento secundario */
--green:  #2ECC71;  /* verde crypto — solo detalles, nunca dominante */
```

## Tipografía
- Títulos e impacto: `Barlow Condensed` 900 italic (Google Fonts)
- Números y contadores: `Orbitron` 700 (Google Fonts)

---

## Efectos de arcade obligatorios

```css
/* Scanlines CRT */
body::after {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:9999;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px);
}

@keyframes neon-flicker {
  0%,19%,21%,23%,25%,54%,56%,100%{opacity:1} 20%,24%,55%{opacity:0.4}
}
@keyframes neon-pulse {
  0%,100%{box-shadow:0 0 8px #F0B90B,0 0 20px #F0B90B44}
  50%{box-shadow:0 0 16px #F0B90B,0 0 40px #F0B90B88}
}
@keyframes glitch {
  0%,100%{transform:translate(0)} 20%{transform:translate(-3px,1px)}
  40%{transform:translate(3px,-1px)} 60%{transform:translate(-2px,2px)}
}
@keyframes countdown-boom {
  0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1}
}
@keyframes confetti-fall {
  0%{transform:translateY(-20px) rotate(0deg);opacity:1}
  100%{transform:translateY(100vh) rotate(720deg);opacity:0}
}
@keyframes tap-ripple {
  0%{transform:scale(0);opacity:0.8} 100%{transform:scale(3);opacity:0}
}
@keyframes slot-enter {
  0%{transform:translateY(-20px);opacity:0} 100%{transform:translateY(0);opacity:1}
}
@keyframes score-pop {
  0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-60px);opacity:0}
}
```

---

## display.html — Pantalla principal (1920×1080)

### Header fijo — todas las vistas
- `◆ BINANCE` arriba izquierda, Barlow Condensed 700, `#F0B90B`, 18px
- Fondo `#0B0E11` + scanlines CRT

### Vista: waiting (lobby)
Layout dos columnas — izquierda contenido, derecha ilustración:

**Columna izquierda:**
- `BINANCE` Barlow Condensed 900 italic, `#F0B90B`, 72px, `neon-flicker`
- `PIZZA DAY` mismo estilo, 96px
- `BTC PIZZA RUSH` Barlow Condensed 700, `#C87D2A`, 28px
- QR con borde 3px `#F0B90B` + `neon-pulse`
- Grid 2×2 de slots:
  - Vacío: borde punteado 2px `#F0B90B44`, texto `INSERT PLAYER` parpadeando, fondo `#0D1117`
  - Ocupado: borde 2px `#F0B90B` + `neon-pulse`, BUID en `#2ECC71` Orbitron 700, `slot-enter`

**Columna derecha:**
- `pizza.png` grande (400-500px), animación `float` + `glow-pulse`, `pointer-events:none`
- `bitcoin.png` debajo o superpuesto, más pequeño (200px), `slow-rotate` muy lento (20s)

**Footer:**
- `SHARE A PIZZA, SHARE A BITCOIN` centrado, `#2ECC71`, 14px, parpadeando suave

### Vista: countdown
- `GET READY` Barlow Condensed 900 italic, `#C87D2A`, 48px, arriba centrado, parpadeando
- Número gigante centrado, Barlow Condensed 900 italic, `#F0B90B`, 280px
- `text-shadow: 0 0 20px #F0B90B, 0 0 60px #F0B90B88`
- `countdown-boom` en cada número
- `pizza.png` pequeño (150px) flotando en esquina, `float` + `glow-pulse`

### Vista: playing
Grid 2×2, cada card:
- Fondo `#0D1117`, borde 2px color único del jugador con glow
- Header: BUID Orbitron 700, color del jugador
- `pizza.png` pequeño (80px) en la card, `glow-pulse`
- Contador `🍕 × N` Orbitron 700, `#F0B90B`, 48px, glow
- Barra de progreso: fondo `#1A1A1A`, relleno `#F0B90B` con glow, animación fluida
- `BITE!` con `score-pop` al completar pizza
- Timer global: barra horizontal arriba full-width, verde→amarillo→rojo

### Vista: results
- `trophy.png` centrado grande (300px), `trophy-celebrate` en loop
- `WINNER` Barlow Condensed 900 italic, `#F0B90B`, 120px, `glitch`
- BUID ganador Orbitron 700, `#2ECC71`, 56px, glow verde
- `pizza.png` y `bitcoin.png` flotando a los lados del trophy
- Tabla posiciones: cards `#0D1117`, borde color jugador
- 40 divs confeti `#F0B90B` y `#2ECC71`, `confetti-fall`, delays 0-3s

---

## mobile.html — Pantalla del jugador (375px)

### Header fijo
- `◆ BINANCE` izquierda, `PIZZA DAY` derecha — `#F0B90B`, Barlow Condensed 700, 14px

### Vista: ingreso BUID
- `pizza.png` centrado, 180px, `float` + `glow-pulse`
- `BINANCE PIZZA DAY` Barlow Condensed 900 italic, `#F0B90B`, 40px, `neon-flicker`
- `BTC PIZZA RUSH` `#C87D2A`, 20px
- Input: fondo `#0D1117`, borde 2px `#F0B90B`, texto blanco, padding 16px
- Botón `¡UNIRSE!`: fondo `#F0B90B`, texto `#0B0E11`, Barlow Condensed 900, 22px, full-width
- Error: `#E63946`, shake animation

### Vista: sala de espera
- `WAITING FOR PLAYERS` Orbitron, `#F0B90B`, puntos animados
- `bitcoin.png` 120px, `slow-rotate` 20s, centrado
- Lista jugadores BUID en `#2ECC71`, `slot-enter`

### Vista: countdown
- Número gigante full-screen, Barlow Condensed 900 italic, `#F0B90B`, glow
- `countdown-boom` + `navigator.vibrate(200)`
- `pizza.png` pequeño flotando arriba

### Vista: jugando (TAP)
- Barra de progreso arriba: 8px alto, `#F0B90B` con glow, hacia próxima pizza
- Contador `🍕 × N` Orbitron 700, `#F0B90B`, 28px
- **Botón TAP** (65% de altura pantalla):
  - Fondo `#0D1117`
  - Borde 4px `#F0B90B` + `neon-pulse`
  - `pizza.png` 100px centrado dentro del botón, `glow-pulse`
  - Texto `¡COMER!` Barlow Condensed 900 italic, `#F0B90B`, 48px
  - Al tap: `tap-ripple` (div absoluto amarillo), flash fondo `#F0B90B11`
- `navigator.vibrate(30)` por tap
- `navigator.vibrate([50,30,50])` al completar pizza
- `score-pop`: `+1 🍕` sube sobre el botón al completar pizza

### Vista: resultado
- **Ganó**: `trophy.png` 200px centrado, `trophy-celebrate`, `¡GANASTE!` Barlow Condensed gigante amarillo, confeti
- **Perdió**: `pizza.png` 150px, `BUEN INTENTO` Barlow Condensed `#C87D2A`
- Pizzas comidas: Orbitron 700, `#F0B90B`, grande
- Posición `#1/#2/#3/#4` con color del jugador

---

## Colores únicos por jugador
```css
--player-1: #F0B90B;
--player-2: #2ECC71;
--player-3: #E63946;
--player-4: #9B5DE5;
```

---

## Notas finales
- `pointer-events: none` en TODOS los `<img>` decorativos
- Los PNGs tienen fondo negro que se funde con `#0B0E11` — no necesitan fondo transparente
- Confeti: 40 divs `position:fixed`, 8-12px, colores alternados `#F0B90B`/`#2ECC71`, `animation-delay` 0-3s aleatorio
- Verificar que el botón TAP responde sin lag — `will-change: transform` en elementos animados pesados
- Paleta exclusiva: `#0B0E11`, `#F0B90B`, `#C87D2A`, `#2ECC71`
