# BTC Pizza Rush — Tasks MVP

## [1] Setup
- Crear proyecto Node.js
- Instalar express y socket.io

## [2] Servidor — Estado Global
- Crear servidor Express
- Servir archivos estáticos
- Definir estado global del juego con fases: `waiting` → `countdown` → `playing` → `results`
- Prevenir ingreso de jugadores una vez iniciado el juego o llenos los 4 slots

## [3] Socket.IO — Eventos
- Manejar conexiones
- Manejar desconexiones (liberar slot si estaba en lobby)
- Emitir cambios de fase a todos los clientes en tiempo real

## [4] Mobile — Ingreso
- Input BUID obligatorio
- Validar BUID duplicado al intentar unirse
- Mostrar mensaje de error si BUID ya está registrado (permitir reintentar)
- Confirmar ingreso exitoso y mostrar sala de espera

## [5] Lobby
- Limitar a 4 jugadores
- Mostrar BUIDs de jugadores conectados en tiempo real
- Mostrar slots vacíos restantes
- Cuando slot 4 se llena → servidor inicia countdown automáticamente

## [6] Countdown
- Duración: 3 segundos
- Servidor emite evento de countdown sincronizado
- Todos los clientes (mobile y pantalla principal) muestran cuenta regresiva simultánea
- Animación de tensión/adrenalina en pantalla durante el countdown

## [7] Juego — Lógica de Taps y Pizzas
- Botón TAP visible solo durante fase `playing`
- Enviar taps al servidor vía socket
- Servidor acumula taps por jugador
- Cada 5 taps = 1 pizza comida (lógica server-side)
- Emitir actualización de pizzas en tiempo real a todos los clientes
- Timer de 12 segundos controlado por el servidor

## [8] Mobile — Feedback
- Feedback visual por tap (animación/flash en botón)
- Feedback háptico por tap (`navigator.vibrate`)
- Animación CSS de mordida/celebración al completar cada pizza (cada 5 taps)
- Contador de pizzas visible en pantalla mobile

## [9] Pantalla Principal (Display)
- Mostrar QR para unirse
- Mostrar slots ocupados en tiempo real con BUIDs
- Durante countdown: cuenta regresiva destacada
- Durante juego:
  - Mostrar avatar/personaje CSS animado por jugador
  - Animación de comer se activa con cada pizza completada
  - Contador de pizzas por jugador visible
  - Barra de progreso de pizzas en tiempo real
- Al finalizar: mostrar ganador destacado con animación de celebración

## [10] Animaciones CSS — Estética
- Estilo inspirado en pantallas de carga de Dragon Ball Budokai Tenkaichi 3
- Temática Bitcoin Pizza Day
- Avatar/personaje comiendo pizza en loop (CSS keyframes)
- Animación de mordida que se dispara cada pizza completada
- Pizzas acumuladas visibles (iconos 🍕 o ilustración CSS)
- Countdown con animación de tensión
- Celebración de ganador (confeti CSS o efecto de destello)
- Todo en CSS puro, sin canvas ni motor 2D

## [11] Resultado
- Determinar ganador al finalizar los 12 segundos (mayor cantidad de pizzas)
- En caso de empate: definir por mayor cantidad de taps acumulados
- Mostrar ganador en mobile con animación
- Mostrar ganador en pantalla principal con animación de celebración

## [12] Reinicio
- Resetear estado del servidor a `waiting`
- Limpiar jugadores, taps y pizzas acumuladas
- Notificar a todos los clientes para volver a lobby
- Pantalla principal vuelve a mostrar QR
