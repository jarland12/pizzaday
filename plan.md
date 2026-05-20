# BTC Pizza Rush — Plan de Ejecución (MVP)

## Objetivo
Activación interactiva para Bitcoin Pizza Day donde 4 jugadores compiten tocando rápido desde sus celulares para ver quién come más pizzas en 12 segundos.

## Concepto
- 4 jugadores por QR
- Ingreso obligatorio de BUID
- 12 segundos de juego
- Cada 5 taps = 1 pizza comida
- Mayor cantidad de pizzas comidas gana

## Mecánica de Pizzas
- La unidad de progreso visible es la **pizza**, no el tap
- 5 taps acumulados = 1 pizza comida (animación de mordida)
- En 12 segundos un jugador casual come ~8 pizzas, uno rápido ~16
- La diferencia entre jugadores es visible y genera competitividad
- Cada pizza completada dispara una animación de recompensa

## Estética Visual
- Inspirada en las pantallas de carga de Dragon Ball Budokai Tenkaichi 3
- Temática Bitcoin Pizza Day
- Animaciones CSS puras (sin motor 2D, sin canvas)
- Cada jugador tiene un personaje/avatar comiendo pizzas en loop
- La animación de comer se activa con cada pizza completada
- Pantalla principal muestra los 4 jugadores con sus pizzas acumuladas en tiempo real

## MVP incluye
- QR para acceso mobile
- Lobby 4 jugadores con detección en tiempo real
- Input BUID obligatorio (con validación de duplicado)
- Feedback visual y háptico por tap
- Animación CSS de mordida/pizza comida cada 5 taps
- Contador de pizzas por jugador en mobile y pantalla principal
- Pantalla principal (display) con QR + estado en vivo + barras de progreso de pizzas
- Ganador al finalizar (quien más pizzas comió)
- Guardado en memoria
- Reinicio automático para siguiente ronda

## Stack
- Node.js
- Socket.IO
- HTML/CSS/JS (animaciones CSS puras)
- Red local

## Flujo
1. Escanea QR
2. Ingresa BUID (valida duplicado, avisa si ya existe)
3. Lobby — espera hasta que los 4 slots estén ocupados
4. El servidor detecta slot 4 ocupado → inicia countdown automáticamente
5. Countdown de 3 segundos (genera adrenalina)
6. Juego — 12 segundos, cada 5 taps come una pizza, animación CSS por pizza
7. Ganador mostrado en mobile y pantalla principal (quien más pizzas comió)
8. Reinicio automático → vuelve a lobby

## Fases del estado del servidor
- `waiting`    → lobby abierto, esperando jugadores
- `countdown`  → 3s antes de arrancar
- `playing`    → 12s de juego activo
- `results`    → mostrando ganador

## Decisiones de diseño
- **Inicio automático**: el juego arranca solo cuando los 4 slots se llenan
- **Countdown**: 3 segundos, sincronizado vía socket en todos los dispositivos
- **BUID duplicado**: mensaje de error, el jugador puede reintentar con otro BUID
- **Unidad de juego**: 5 taps = 1 pizza (balance entre adrenalina y legibilidad visual)
- **Feedback por tap**: vibración háptica + animación visual en cada tap
- **Feedback por pizza**: animación CSS de mordida/celebración cada 5 taps
- **Animaciones**: CSS puro, sin canvas ni motor 2D
- **Anti-cheat**: no incluido en MVP (evento controlado)
- **Pantalla principal**: QR, slots en tiempo real, pizzas acumuladas por jugador, ganador al final
