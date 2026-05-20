# BTC Pizza Rush — Prompt Maestro para Antigravity

## Contexto del proyecto
Activación interactiva para **Bitcoin Pizza Day**. 4 jugadores escanean un QR desde sus celulares y compiten en tiempo real para ver quién come más pizzas en 12 segundos. Gana quien más pizzas complete. Es una app web en red local, no un videojuego con motor 2D.

## Stack obligatorio
- Node.js + Express
- Socket.IO (comunicación en tiempo real)
- HTML/CSS/JS puro (sin frameworks de frontend)
- Animaciones en CSS puro con keyframes
- Red local

## ⚠️ Restricciones explícitas de stack
- **NO usar Phaser, PixiJS, Three.js, Babylon.js ni ningún framework de juego**
- **NO usar canvas ni WebGL**
- **NO usar React, Vue, Angular ni ningún framework de frontend**
- Toda la lógica de juego (taps, pizzas, timer) vive **exclusivamente en el servidor**
- Los clientes solo reciben eventos y renderizan — nunca calculan estado

## Estructura de archivos esperada
```
btc-pizza-rush/
├── server.js
├── package.json
└── public/
    ├── display.html     ← pantalla principal (proyector/TV)
    ├── mobile.html      ← pantalla del jugador en su celular
    ├── style.css        ← estilos y animaciones CSS compartidos
    └── client.js        ← lógica de cliente compartida
```

## Fases del juego (estado en servidor)
```
waiting → countdown → playing → results
```
- `waiting`: lobby abierto, esperando 4 jugadores
- `countdown`: 3 segundos de cuenta regresiva — inicia automático al llegar jugador 4
- `playing`: 12 segundos de juego activo
- `results`: ganador mostrado, espera reinicio automático

## Mecánica central
- Cada jugador ingresa su BUID al entrar
- Si el BUID ya está registrado → error con mensaje, puede reintentar
- El juego inicia solo cuando los 4 slots están ocupados
- Durante `playing`: cada tap se envía al servidor
- **5 taps = 1 pizza comida** (calculado server-side)
- Al terminar los 12 segundos, gana quien más pizzas comió
- Empate → desempata por mayor cantidad de taps totales

## Estética visual
- Inspirada en las pantallas de carga de Dragon Ball Budokai Tenkaichi 3
- Temática Bitcoin Pizza Day
- Fondo oscuro, colores naranja y dorado (paleta Bitcoin)
- Cada jugador tiene un avatar/personaje CSS animado comiendo pizza
- La animación de morder/comer se dispara con cada pizza completada
- Pizzas acumuladas se muestran como íconos 🍕
- Countdown con animación de tensión/pulso
- Celebración de ganador con efecto CSS (confeti, destello)
- Todo en CSS keyframes — sin canvas, sin librerías de animación

## Eventos Socket.IO

### Cliente → Servidor
- `join` → `{ buid }` — jugador quiere unirse
- `tap` → sin payload — jugador tapea durante `playing`

### Servidor → Cliente
- `joined` → `{ slot, players }` — confirmación de ingreso
- `join_error` → `{ message }` — BUID duplicado u otro error
- `lobby_update` → `{ players }` — slots en tiempo real
- `countdown` → `{ seconds }` — tick 3, 2, 1
- `game_start` → sin payload — inicia fase `playing`
- `tap_update` → `{ players: [{ buid, taps, pizzas }] }` — estado en tiempo real
- `game_over` → `{ winner, players }` — resultado final
- `reset` → sin payload — volver a lobby

## Mobile (mobile.html)
- Pantalla 1: form con input BUID + botón Unirse
- Pantalla 2: sala de espera con slots ocupados en tiempo real
- Pantalla 3: countdown animado 3-2-1
- Pantalla 4: botón TAP ocupa toda la pantalla, contador de pizzas, feedback visual (flash) y háptico (`navigator.vibrate(30)`) por tap, animación de pizza completada cada 5 taps
- Pantalla 5: resultado con ganador

## Pantalla principal (display.html)
- `waiting`: QR grande para unirse + slots ocupados en tiempo real
- `countdown`: cuenta regresiva 3-2-1 con animación de pulso
- `playing`: 4 jugadores con avatar CSS animado, contador 🍕 por jugador, barra de progreso de pizzas en vivo, animación de comer activa por jugador
- `results`: ganador destacado con animación de celebración CSS

## Tasks en orden de ejecución

### [1] Setup
- Crear `package.json` con dependencias: express, socket.io
- Crear `server.js` base con Express sirviendo `/public`
- Verificar que el servidor levanta en puerto 3000

### [2] Estado global del servidor
- Objeto de estado: fase, jugadores `(buid, taps, pizzas, slot)`, timer
- Lógica de transición entre fases
- Bloquear ingreso fuera de fase `waiting` o con slots llenos

### [3] Socket.IO — eventos del servidor
- Evento `join`: validar BUID duplicado, asignar slot, emitir `joined` o `join_error`
- Detectar slot 4 ocupado → iniciar countdown automáticamente
- Evento `tap`: acumular taps, calcular pizzas `(Math.floor(taps / 5))`, emitir `tap_update`
- Timer de 12s server-side con `game_over` al finalizar
- Lógica de reinicio y emisión de `reset`

### [4] mobile.html + lógica de cliente
- Flujo de 5 pantallas por fase recibida del servidor
- Envío de BUID y manejo de error con mensaje visible
- Botón TAP con `navigator.vibrate(30)` + clase CSS de flash
- Animación de pizza completada cuando `pizzas` aumenta
- Contador de pizzas del jugador visible en todo momento

### [5] display.html + pantalla principal
- Recepción de todos los eventos del servidor
- Vista lobby con QR apuntando a IP local puerto 3000 y slots
- Vista countdown con animación de pulso
- Vista juego: 4 avatares CSS con animación de comer, contadores y barras
- Vista resultado con celebración CSS

### [6] Animaciones CSS (style.css)
- Avatar comiendo pizza: CSS keyframes en loop
- Animación de mordida que se dispara al completar cada pizza
- Flash en botón TAP mobile
- Pulso en countdown
- Celebración de ganador: confeti CSS o destello
- Paleta: fondo `#1a1a1a`, naranja `#f7931a`, dorado `#ffd700`

## Notas críticas para el agente
- El servidor es la única fuente de verdad — taps y pizzas se calculan SOLO server-side
- Los clientes nunca calculan estado, solo renderizan lo que el servidor emite
- El QR en `display.html` debe generarse con la IP local del servidor en puerto 3000 (usar librería `qrcode` o CDN)
- No hay base de datos — todo en memoria
- No hay anti-cheat — es un evento presencial controlado
- Después de cada task principal, verificar que funciona antes de continuar con la siguiente
