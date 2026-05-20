const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const winnersFile = path.join(__dirname, 'winners.json');
let hallOfFame = [];
if (fs.existsSync(winnersFile)) {
    try {
        hallOfFame = JSON.parse(fs.readFileSync(winnersFile, 'utf8'));
    } catch(e) { console.error('Error reading winners.json', e); }
}

function saveWinner(player) {
    const entry = {
        buid: player.buid,
        pizzas: player.pizzas,
        taps: player.taps,
        date: new Date().toLocaleDateString()
    };
    hallOfFame.unshift(entry);
    if (hallOfFame.length > 5) hallOfFame = hallOfFame.slice(0, 5); // Keep top 5
    fs.writeFileSync(winnersFile, JSON.stringify(hallOfFame, null, 2));
    io.emit('hall_of_fame_update', hallOfFame);
}

const GAME_PHASES = {
    WAITING: 'waiting',
    COUNTDOWN: 'countdown',
    PLAYING: 'playing',
    RESULTS: 'results'
};

const gameState = {
    phase: GAME_PHASES.WAITING,
    players: [], // { buid: string, taps: number, pizzas: number, slot: number, id: string }
    countdownSeconds: 3,
    gameSeconds: 12,
    timerInterval: null
};

function getAvailableSlot() {
    const slots = [1, 2, 3, 4];
    const occupied = gameState.players.map(p => p.slot);
    return slots.find(s => !occupied.includes(s)) || null;
}

function startGameCountdown() {
    gameState.phase = GAME_PHASES.COUNTDOWN;
    gameState.countdownSeconds = 3;
    io.emit('countdown', { seconds: gameState.countdownSeconds });
    
    gameState.timerInterval = setInterval(() => {
        gameState.countdownSeconds--;
        if (gameState.countdownSeconds > 0) {
            io.emit('countdown', { seconds: gameState.countdownSeconds });
        } else {
            clearInterval(gameState.timerInterval);
            startGamePlaying();
        }
    }, 1000);
}

function startGamePlaying() {
    gameState.phase = GAME_PHASES.PLAYING;
    io.emit('game_start');
    
    gameState.timerInterval = setInterval(() => {
        gameState.gameSeconds--;
        if (gameState.gameSeconds <= 0) {
            clearInterval(gameState.timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameState.phase = GAME_PHASES.RESULTS;
    
    let winner = null;
    if (gameState.players.length > 0) {
        // Sort by pizzas descendant, then taps descendant
        const sortedPlayers = [...gameState.players].sort((a, b) => {
            if (b.pizzas !== a.pizzas) return b.pizzas - a.pizzas;
            if (b.taps !== a.taps) return b.taps - a.taps;
            // Desempate justo: Gana el que alcanzó el último tap primero en milisegundos
            return (a.lastTapTime || 0) - (b.lastTapTime || 0); 
        });
        
        const first = sortedPlayers[0];
        if (first.taps === 0) {
            winner = null; // Nadie tapeó nada
        } else {
            winner = first; // Como el desempate por milisegundo es exacto, siempre hay 1er lugar.
        }

        if (winner) {
            saveWinner(winner);
        }
    }
    
    io.emit('game_over', { winner, players: gameState.players });
    
    gameState.restartSeconds = 30;
    io.emit('restart_countdown', { seconds: gameState.restartSeconds });
    
    gameState.timerInterval = setInterval(() => {
        gameState.restartSeconds--;
        if (gameState.restartSeconds > 0) {
            io.emit('restart_countdown', { seconds: gameState.restartSeconds });
        } else {
            clearInterval(gameState.timerInterval);
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.phase = GAME_PHASES.WAITING;
    gameState.players = [];
    gameState.countdownSeconds = 3;
    gameState.gameSeconds = 12;
    io.emit('reset');
    io.emit('lobby_update', { players: gameState.players });
}

io.on('connection', (socket) => {
    // Send immediate state to newly connected client
    socket.emit('lobby_update', { players: gameState.players });
    socket.emit('hall_of_fame_update', hallOfFame);

    socket.on('join', ({ buid }) => {
        if (gameState.phase !== GAME_PHASES.WAITING) {
            return socket.emit('join_error', { message: 'Game already in progress' });
        }
        
        if (gameState.players.some(p => p.buid === buid)) {
            return socket.emit('join_error', { message: 'BUID ya está registrado' });
        }

        const slot = getAvailableSlot();
        if (!slot) {
            return socket.emit('join_error', { message: 'Lobby is full' });
        }

        const player = { buid, taps: 0, pizzas: 0, slot, id: socket.id, lastTapTime: 0 };
        gameState.players.push(player);
        
        socket.emit('joined', { slot, players: gameState.players });
        io.emit('lobby_update', { players: gameState.players });

        if (gameState.players.length === 4) {
            startGameCountdown();
        }
    });

    socket.on('tap', () => {
        if (gameState.phase !== GAME_PHASES.PLAYING) return;
        
        const player = gameState.players.find(p => p.id === socket.id);
        if (!player) return;
        
        // Rate limiter: Max ~15 taps per second (66ms minimum between taps)
        const now = Date.now();
        if (now - player.lastTapTime < 66) return; // Prevent botting
        player.lastTapTime = now;
        
        player.taps++;
        player.pizzas = Math.floor(player.taps / 5);
        
        io.emit('tap_update', { players: gameState.players.map(p => ({ buid: p.buid, taps: p.taps, pizzas: p.pizzas, slot: p.slot })) });
    });

    socket.on('disconnect', () => {
        // If a player disconnects during waiting, remove them and free the slot
        if (gameState.phase === GAME_PHASES.WAITING) {
            const initialLength = gameState.players.length;
            gameState.players = gameState.players.filter(p => p.id !== socket.id);
            if (gameState.players.length < initialLength) {
                io.emit('lobby_update', { players: gameState.players });
            }
        }
    });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up server to run on port 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
