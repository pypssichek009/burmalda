const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');
const logEl = document.getElementById('log');

let state = {
  balance: 1000,
  fighters: [
    { name: 'Мулатов', x: 40, y: 90, color: '#ff4444', hp: 100, hpMax: 100 },
    { name: 'Дёмкин',  x: 260, y: 90, color: '#4444ff', hp: 100, hpMax: 100 },
  ]
};

function draw() {
  ctx.fillStyle = '#1a2f5a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#0a1628';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 8) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 8) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  state.fighters.forEach(f => {
    ctx.fillStyle = '#000';
    ctx.fillRect(f.x - 4, f.y - 16, 24, 4);
    ctx.fillStyle = '#00ff44';
    ctx.fillRect(f.x - 4, f.y - 16, 24 * (f.hp / f.hpMax), 4);

    ctx.fillStyle = f.color;
    ctx.fillRect(f.x, f.y, 14, 14);

    ctx.fillStyle = '#fff';
    ctx.fillRect(f.x + 3, f.y + 4, 2, 2);
    ctx.fillRect(f.x + 9, f.y + 4, 2, 2);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px monospace';
    ctx.fillText(f.name, f.x - 8, f.y - 20);
  });
}

function updateUI() {
  document.getElementById('balance').textContent = state.balance;
}

function log(text) {
  logEl.textContent = text;
}

document.getElementById('btn-spin').onclick = () => {
  const symbols = ['🍫', '🍩', '🍒', '💎', '7️⃣', '🍋'];
  const reel = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  let win = 0;
  if (reel[0] === reel[1] && reel[1] === reel[2]) {
    win = 200;
  } else if (reel[0] === reel[1] || reel[1] === reel[2] || reel[0] === reel[2]) {
    win = 50;
  }
  state.balance -= 100;
  state.balance += win;
  updateUI();
  log(`${reel.join(' ')}  →  ${win > 0 ? '+' + win : '-100'} монет`);
  if (tg) tg.HapticFeedback.impactOccurred('medium');
};

document.getElementById('btn-fight').onclick = () => {
  state.fighters.forEach(f => { f.hp = f.hpMax; });
  let turn = 0;
  const interval = setInterval(() => {
    state.fighters.forEach((f, i) => {
      f.x += (Math.random() - 0.5) * 16;
      f.x = Math.max(10, Math.min(296, f.x));
    });
    if (turn > 3) {
      const loser = Math.random() < 0.5 ? 0 : 1;
      state.fighters[loser].hp = Math.max(0, state.fighters[loser].hp - 15);
    }
    draw();
    turn++;
    if (turn > 20) {
      clearInterval(interval);
      const winner = state.fighters[0].hp > state.fighters[1].hp ? 0 : 1;
      state.balance += 150;
      updateUI();
      log(`🏆 Победил ${state.fighters[winner].name}! +150`);
      state.fighters[0].hp = state.fighters[0].hpMax;
      state.fighters[1].hp = state.fighters[1].hpMax;
      draw();
    }
  }, 120);
};

document.getElementById('btn-pvp').onclick = () => {
  if (tg) tg.showAlert('PvP скоро появится!');
  else alert('PvP скоро!');
};

draw();
updateUI();
