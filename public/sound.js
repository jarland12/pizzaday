let audioCtx = null;
const sounds = {};

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

async function loadSound(name, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('File not found');
    const arrayBuffer = await response.arrayBuffer();
    sounds[name] = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (e) {
    console.warn(`Sound ${name} not loaded, will use fallback.`, e);
    sounds[name] = null; // Mark as explicit null
  }
}

async function loadAllSounds() {
  initAudio();
  await Promise.all([
    loadSound('tap', '/assets/sounds/tap.wav'),
    loadSound('pizzaComplete', '/assets/sounds/pizza-complete.wav'),
    loadSound('countdown', '/assets/sounds/countdown.wav'),
    loadSound('gameStart', '/assets/sounds/game-start.wav'),
    loadSound('winner', '/assets/sounds/winner.wav'),
    loadSound('join', '/assets/sounds/join.wav'),
    loadSound('bgMusic', '/assets/sounds/bg-music.mp3')
  ]);
}

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

function playSound(name, volume = 1.0) {
  if (!audioCtx) return;
  
  // If sound successfully loaded from network, play the buffer
  if (sounds[name]) {
    const source = audioCtx.createBufferSource();
    const gainNode = audioCtx.createGain();
    source.buffer = sounds[name];
    gainNode.gain.value = volume;
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(0);
  } else {
    // Missing or failed download, use fallback synthesizer mapped by name
    if (name === 'tap') playBeep(800, 0.05, volume * 0.3);
    else if (name === 'pizzaComplete') playBeep(1200, 0.15, volume * 0.4);
    else if (name === 'countdown') playBeep(600, 0.1, volume * 0.3);
    else if (name === 'gameStart') playBeep(880, 0.3, volume * 0.5);
    else if (name === 'winner') playBeep(1047, 0.5, volume * 0.6);
    else if (name === 'join') playBeep(500, 0.08, volume * 0.3);
  }
}

let bgMusicSource = null;
let bgMusicGain = null;

function setBgMusicVolume(volume) {
  if (bgMusicGain && audioCtx) {
    // Smooth volume transition over 1 second to avoid clicking/abrupt changes
    bgMusicGain.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.5);
  }
}

function startBgMusic() {
  if (!audioCtx || bgMusicSource) return;
  // If the MP3 failed to load, don't crash, just ignore background music
  if (!sounds['bgMusic']) return;

  bgMusicSource = audioCtx.createBufferSource();
  bgMusicGain = audioCtx.createGain();
  
  bgMusicSource.buffer = sounds['bgMusic'];
  bgMusicSource.loop = true;
  
  bgMusicGain.gain.value = 0.25; // Default lobby volume
  
  bgMusicSource.connect(bgMusicGain);
  bgMusicGain.connect(audioCtx.destination);
  
  bgMusicSource.start(0);
}

function stopBgMusic() {
  if (bgMusicSource) {
    try { bgMusicSource.stop(0); } catch(e) {}
    bgMusicSource.disconnect();
    bgMusicGain.disconnect();
    bgMusicSource = null;
    bgMusicGain = null;
  }
}

