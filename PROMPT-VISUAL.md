# BTC Pizza Rush — Prompt de Rediseño Visual
## Binance Pizza Day — Identidad Oficial

## ⚠️ Reglas críticas
- **NO tocar** `server.js` ni la lógica de Socket.IO
- **NO cambiar** IDs ni clases CSS que manejen eventos o fases del juego
- Solo modificar la capa visual: colores, tipografía, animaciones, layout, efectos
- Los assets del branding están en `/public/assets/` — úsalos como referencia visual
- Estrategia de ilustraciones: primero intentar recrear en SVG inline fiel al branding; si el SVG no logra la fidelidad visual, usar el JPG directamente como elemento decorativo con `opacity` reducida o como fondo de card
- Las imágenes JPG del branding pueden usarse directamente con `<img>` o `background-image` donde aporten valor visual
- Mantener toda la funcionalidad existente intacta

---

## Estilo visual objetivo
**Neón del branding Binance Pizza Day + energía de arcade.**
Piensa en un letrero de pizzería diner de los 80s pero en versión crypto: trazos neón brillantes, fondo negro profundo, tipografía bold italic contundente, scanlines de CRT, glow intenso. Es un juego de evento — tiene que gritar energía desde el proyector.

---

## Paleta de colores oficial

```css
--black:       #0B0E11;   /* fondo principal */
--yellow:      #F0B90B;   /* amarillo Binance — color dominante */
--gold:        #C87D2A;   /* dorado — acento secundario */
--green:       #2ECC71;   /* verde crypto — detalles y acentos */
--white:       #FFFFFF;
--glow-yellow: 0 0 10px #F0B90B, 0 0 30px #F0B90B88, 0 0 60px #F0B90B44;
--glow-green:  0 0 10px #2ECC71, 0 0 30px #2ECC7188;
```

---

## Tipografía
- Títulos: `Barlow Condensed` 900 italic (Google Fonts) — bold, contundente, igual al branding
- Contadores y números de juego: `Orbitron` 700 — futurista con glow
- Importar ambas desde Google Fonts CDN

---

## Ilustraciones SVG inline obligatorias
Recrear en SVG inline las ilustraciones del branding oficial. Estas son las piezas clave:

### 1. Pizza Neón (elemento principal)
```
Triángulo de pizza visto desde arriba:
- Forma triangular con bordes redondeados
- Stroke neón amarillo #F0B90B, fill transparente
- 3-4 círculos pequeños verdes #2ECC71 simulando toppings crypto (símbolo ◆)
- box-shadow / filter: drop-shadow con glow amarillo
- Versión grande para fondo decorativo
- Versión pequeña para avatares de jugador
```

### 2. Bitcoin Pizza (elemento secundario)
```
Círculo con símbolo ₿ en el centro:
- Stroke neón amarillo, fill transparente
- ₿ en el centro en amarillo con glow
- Líneas de "rebanada" que lo cruzan como una pizza
- Puntos verdes decorativos alrededor
```

### 3. Logo ◆ BINANCE
```
- Símbolo ◆ en amarillo seguido de texto BINANCE
- Tamaño pequeño, esquina superior izquierda en todas las pantallas
- Font: Barlow Condensed bold
```

Estos SVGs deben estar definidos como componentes reutilizables en style.css o como <symbol> en el HTML y referenciados con <use>.

---

## Efectos de arcade obligatorios

```css
/* Scanlines CRT — overlay sutil sobre toda la pantalla */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

/* Animaciones obligatorias */
@keyframes neon-flicker   /* parpadeo neón irregular en títulos */
@keyframes neon-pulse     /* glow pulsante en bordes */
@keyframes pizza-float    /* pizzas SVG flotando en fondo */
@keyframes pizza-rotate   /* rotación lenta de pizza decorativa */
@keyframes pizza-bite     /* animación de mordida en avatar */
@keyframes glitch         /* efecto glitch en WINNER */
@keyframes countdown-boom /* zoom explosivo en números countdown */
@keyframes confetti-fall  /* confeti amarillo+verde cayendo */
@keyframes tap-ripple     /* onda neón al tapear */
@keyframes slot-enter     /* entrada de jugador al lobby */
@keyframes score-pop      /* +1🍕 que sube y desaparece */
@keyframes crt-flicker    /* parpadeo muy sutil de toda la pantalla */
```

---

## display.html — Pantalla principal (proyector/TV)

### Header fijo (todas las vistas)
- `◆ BINANCE` arriba izquierda — amarillo `#F0B90B`, Barlow Condensed bold
- Fondo siempre `#0B0E11` + scanlines CRT

### Vista: waiting (lobby)
Layout: izquierda QR + texto, derecha grid de 4 slots

- Título `BINANCE` grande + `PIZZA DAY` más grande debajo, Barlow Condensed 900 italic, amarillo con neon-flicker
- Subtítulo `BTC PIZZA RUSH` en dorado `#C87D2A`
- QR con borde neón amarillo pulsante (neon-pulse)
- SVG de pizza neón flotando en fondo (pizza-float + pizza-rotate)
- 4 slots como cards arcade:
  - Vacío: borde punteado amarillo tenue, texto `INSERT PLAYER` parpadeando, fondo `#111318`
  - Ocupado: borde sólido amarillo con glow, BUID en verde `#2ECC71` con glow, animación slot-enter
- Footer: `"SHARE A PIZZA, SHARE A BITCOIN"` centrado, verde tenue parpadeando

### Vista: countdown
- Número ocupa 80% de pantalla, Barlow Condensed 900 italic
- Amarillo con glow intenso + countdown-boom en cada número
- `GET READY` arriba parpadeando
- Fondo con pulso muy sutil amarillo

### Vista: playing
Grid 2x2 — cada card de jugador:
- Header: BUID con color único de jugador + glow
- SVG pizza neón pequeño con animación bite en loop
- Barra de progreso de pizzas: fondo `#1A1A1A`, relleno amarillo con glow, animación fluida
- Contador `🍕 × N` en Orbitron con glow
- Texto `BITE!` que aparece/desaparece al completar pizza (score-pop)
- Timer global: barra horizontal arriba, verde→amarillo→rojo con glow, Orbitron countdown

### Vista: results
- Texto `WINNER` en Barlow Condensed 900 italic gigante, efecto glitch amarillo
- BUID ganador en verde neón `#2ECC71`, Orbitron, glow intenso
- SVG Bitcoin Pizza animado girando detrás del ganador
- Tabla de resultados con pizzas por jugador
- Confeti CSS amarillo `#F0B90B` y verde `#2ECC71` cayendo
- Footer: `SHARE A PIZZA, SHARE A BITCOIN` parpadeando

---

## mobile.html — Pantalla del jugador

### Header (todas las vistas)
- `◆ BINANCE` arriba izquierda, `PIZZA DAY` arriba derecha — ambos pequeños, amarillo

### Vista: ingreso BUID
- SVG pizza neón centrada, animada
- Título `BTC PIZZA RUSH` Barlow Condensed, amarillo con flicker
- Input: fondo `#111318`, borde amarillo, texto blanco, placeholder gris
- Botón `¡UNIRSE!`: fondo `#F0B90B`, texto `#0B0E11` negro bold, sin border-radius excesivo
- Error BUID: texto rojo + shake

### Vista: espera lobby
- `WAITING...` con puntos animados en Orbitron
- Lista jugadores con slot-enter
- Slots vacíos con silueta parpadeando

### Vista: countdown
- Número gigante amarillo con glow, countdown-boom
- `navigator.vibrate(200)` por segundo

### Vista: jugando (TAP)
- Botón TAP: ocupa 70% pantalla, fondo `#0B0E11`, borde neón amarillo pulsante grueso
- SVG pizza neón dentro del botón, animada
- Texto `TAP` o `¡COMER!` Barlow Condensed 900 italic, amarillo, enorme
- tap-ripple: onda neón amarilla al tapear
- Flash de pantalla completa en cada tap (opacity pulse muy rápido)
- `navigator.vibrate(30)` por tap
- `navigator.vibrate([50,30,50])` al completar pizza
- Barra de progreso hacia próxima pizza (5 taps): arriba de la pantalla, amarillo con glow
- Contador `🍕 × N` visible siempre — Orbitron, amarillo
- score-pop: `+1 🍕` que aparece y sube al completar pizza

### Vista: resultado
- Ganó: destello dorado, `¡GANASTE!` Barlow Condensed gigante amarillo, confeti
- Perdió: `BUEN INTENTO` con SVG pizza consoladora
- Pizzas comidas en grande con Orbitron
- Posición `#1 / #2 / #3 / #4` con color del jugador

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
- Todas las ilustraciones de pizza y bitcoin son SVG inline — no usar emojis como elemento principal visual
- Los SVGs deben definirse como `<symbol>` reutilizables para no repetir código
- El efecto scanlines CRT va en `body::after` con `pointer-events: none`
- El confeti son 30+ divs con `position:fixed`, colores alternados amarillo/verde, `animation-delay` variado, `pointer-events: none`
- `pointer-events: none` en TODOS los elementos decorativos para no bloquear taps en mobile
- Probar que el botón TAP responde inmediatamente sin lag por animaciones
- Toda la paleta sale únicamente de: `#0B0E11`, `#F0B90B`, `#C87D2A`, `#2ECC71`

---

## Assets de branding disponibles en /public/assets/

Copiar los JPG del branding en esta carpeta antes de ejecutar.
El agente debe referenciarlos así:

```
public/
└── assets/
    ├── branding-key-visual.jpg     ← pizza neón principal + tipografía
    ├── branding-templates.jpg      ← templates del evento con layouts
    ├── branding-colors.jpg         ← paleta oficial de colores
    └── branding-materials.jpg      ← materiales y aplicaciones del evento
```

### Instrucción de uso para el agente
1. **Primero**: intentar recrear las ilustraciones de pizza y ₿ como SVG inline
   fiel al estilo neón de las imágenes de referencia
2. **Si el SVG no logra fidelidad visual**: usar el JPG directamente con `<img>`
   o `background-image`, recortando o posicionando para mostrar solo
   la ilustración relevante
3. Las imágenes pueden usarse como:
   - Fondo decorativo con `opacity: 0.15-0.3` para no competir con el contenido
   - Elemento hero en pantallas de lobby o resultado
   - Referencia de estilo para los SVGs

### Lo más importante a replicar del branding
- Pizza neón: trazo amarillo `#F0B90B` grueso, punta hacia abajo, toppings verdes ◆
- Fondo siempre negro `#0B0E11` — nunca blanco ni claro
- Tipografía bold italic condensada, amarilla, sin espaciado
- Glow/neón en todos los elementos ilustrativos
- Energía visual: que se vea como un letrero de diner neón de los 80s
