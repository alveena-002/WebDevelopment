// game.js
// Client-side Snake game logic. Talks to the Express backend via
// fetch() to save scores and load the high-score leaderboard.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 20;              // size of one cell in pixels
const TILE_COUNT = canvas.width / GRID_SIZE; // 20x20 grid

let snake, direction, nextDirection, food, score, gameLoopId, gameSpeed;
let bestSession = 0;

const scoreEl = document.getElementById('score');
const bestSessionEl = document.getElementById('bestSession');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreEl = document.getElementById('finalScore');
const playerNameInput = document.getElementById('playerName');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const refreshBtn = document.getElementById('refreshBtn');
const saveStatus = document.getElementById('saveStatus');
const leaderboardList = document.getElementById('leaderboardList');

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  nextDirection = { x: 0, y: 0 };
  score = 0;
  gameSpeed = 120; // ms per frame, lower = faster
  scoreEl.textContent = '0';
  placeFood();
}

function placeFood() {
  let valid = false;
  while (!valid) {
    food = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT)
    };
    valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
  }
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
}

function draw() {
  // background
  ctx.fillStyle = '#0d1b1e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // food
  drawCell(food.x, food.y, '#ff5252');

  // snake
  snake.forEach((seg, i) => {
    drawCell(seg.x, seg.y, i === 0 ? '#3ddc84' : '#2a9d5c');
  });
}

function update() {
  direction = nextDirection;

  // If the snake hasn't moved yet, don't run collision logic.
  if (direction.x === 0 && direction.y === 0) return;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Wall collision
  if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
    return endGame();
  }

  // Self collision
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    return endGame();
  }

  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    if (gameSpeed > 60) gameSpeed -= 2; // speed up slightly as score grows
    placeFood();
  } else {
    snake.pop();
  }
}

function gameTick() {
  update();
  draw();
}

let loopTimeout;
function startLoop() {
  clearTimeout(loopTimeout);
  function loop() {
    gameTick();
    loopTimeout = setTimeout(loop, gameSpeed);
  }
  loop();
}

function endGame() {
  clearTimeout(loopTimeout);
  if (score > bestSession) {
    bestSession = score;
    bestSessionEl.textContent = bestSession;
  }
  finalScoreEl.textContent = score;
  saveStatus.textContent = '';
  playerNameInput.value = '';
  gameOverOverlay.classList.remove('hidden');
}

// ---------- Controls ----------
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if ((key === 'arrowup' || key === 'w') && direction.y === 0) {
    nextDirection = { x: 0, y: -1 };
  } else if ((key === 'arrowdown' || key === 's') && direction.y === 0) {
    nextDirection = { x: 0, y: 1 };
  } else if ((key === 'arrowleft' || key === 'a') && direction.x === 0) {
    nextDirection = { x: -1, y: 0 };
  } else if ((key === 'arrowright' || key === 'd') && direction.x === 0) {
    nextDirection = { x: 1, y: 0 };
  }
});

// ---------- Buttons ----------
startBtn.addEventListener('click', () => {
  startOverlay.classList.add('hidden');
  resetGame();
  draw();
  startLoop();
});

restartBtn.addEventListener('click', () => {
  gameOverOverlay.classList.add('hidden');
  resetGame();
  draw();
  startLoop();
});

saveScoreBtn.addEventListener('click', async () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    saveStatus.textContent = 'Please enter a name.';
    return;
  }

  saveScoreBtn.disabled = true;
  saveStatus.textContent = 'Saving...';

  try {
    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: name, score })
    });

    if (!res.ok) throw new Error('Server rejected the score');

    saveStatus.textContent = 'Score saved!';
    loadLeaderboard();
  } catch (err) {
    console.error(err);
    saveStatus.textContent = 'Could not save score. Try again.';
  } finally {
    saveScoreBtn.disabled = false;
  }
});

refreshBtn.addEventListener('click', loadLeaderboard);

// ---------- Leaderboard ----------
async function loadLeaderboard() {
  leaderboardList.innerHTML = '<li class="loading">Loading...</li>';
  try {
    const res = await fetch('/api/highscores');
    if (!res.ok) throw new Error('Failed to fetch');
    const scores = await res.json();

    if (scores.length === 0) {
      leaderboardList.innerHTML = '<li class="empty">No scores yet — be the first!</li>';
      return;
    }

    leaderboardList.innerHTML = scores
      .map(s => `<li><span>${escapeHtml(s.player_name)}</span><span>${s.score}</span></li>`)
      .join('');
  } catch (err) {
    console.error(err);
    leaderboardList.innerHTML = '<li class="empty">Could not load leaderboard.</li>';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Initial setup
draw();
resetGame();
draw();
loadLeaderboard();
