import * as vscode from 'vscode';
import { BaseGame } from './GameInterface';
import { getNonce, getBasicHtmlTemplate } from '../utils/WebviewUtils';

export class SubwaySurfersGame extends BaseGame {
    getName(): string { return "Subway Surfers"; }
    getIcon(): string { return "🏃‍♂️"; }
    getDescription(): string { return "Endless runner with obstacles and coins"; }
    getId(): string { return "subwaySurfers"; }

    getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const nonce = getNonce();
        
        const styles = `
  :root { --lane-count: 3; }
  body { 
    margin: 0; 
    padding: 0; 
    background: #0b1726; 
    font-family: -apple-system, Segoe UI, Arial, sans-serif; 
  }
  #gameContainer {
    width: 100%; 
    height: 100vh; 
    max-height: 600px; 
    position: relative; 
    overflow: hidden; 
    margin: 0 auto;
    background:
      linear-gradient(to right, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px) 33.33% 0/33.33% 100%,
      linear-gradient(to right, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px) 66.66% 0/33.33% 100%,
      radial-gradient(circle at 50% -20%, #4db6ff, #0b1726 55%);
    background-repeat: no-repeat;
  }
  #player { 
    width: 44px; 
    height: 52px; 
    background: linear-gradient(#ffd54f, #f57f17); 
    border-radius: 12px; 
    position: absolute; 
    bottom: 68px; 
    left: 50%; 
    transform: translateX(-50%); 
    transition: left 0.15s ease; 
    z-index: 10; 
    box-shadow: 0 6px 12px rgba(0,0,0,0.35); 
  }
  .obstacle { 
    width: 46px; 
    height: 56px; 
    background: linear-gradient(#455a64, #263238); 
    border-radius: 6px; 
    position: absolute; 
    box-shadow: 0 4px 8px rgba(0,0,0,0.35); 
  }
  .train { 
    width: 64px; 
    height: 120px; 
    background: linear-gradient(#78909c, #37474f); 
    border-radius: 8px; 
    position: absolute; 
    box-shadow: 0 8px 16px rgba(0,0,0,0.45); 
  }
  .coin { 
    width: 26px; 
    height: 26px; 
    background: #ffeb3b; 
    border-radius: 50%; 
    position: absolute; 
    border: 3px solid #ffa000; 
    box-shadow: 0 2px 6px rgba(0,0,0,0.35); 
    animation: spin 1s linear infinite; 
  }
  @keyframes spin { 
    from { transform: translateX(-50%) rotateY(0); } 
    to { transform: translateX(-50%) rotateY(360deg); } 
  }
  #score { 
    position: absolute; 
    top: 10px; 
    left: 10px; 
    color: #fff; 
    font-weight: 700; 
    z-index: 100; 
    text-shadow: 2px 2px 4px rgba(0,0,0,0.6); 
    font-size: 16px; 
  }
  #controls { 
    position: absolute; 
    bottom: 10px; 
    left: 50%; 
    transform: translateX(-50%); 
    color: #fff; 
    text-align: center; 
    font-size: 12px; 
    z-index: 100; 
    background: rgba(0,0,0,0.35); 
    padding: 8px 10px; 
    border-radius: 8px; 
  }
  .game-over { 
    position: absolute; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    background: rgba(0,0,0,0.85); 
    color: #fff; 
    padding: 20px; 
    border-radius: 12px; 
    text-align: center; 
    z-index: 1000; 
    border: 2px solid #ffd54f; 
  }
  .btn { 
    background: #ffd54f; 
    color: #333; 
    border: none; 
    padding: 8px 16px; 
    border-radius: 6px; 
    font-size: 14px; 
    cursor: pointer; 
    margin-top: 10px; 
  }
  .btn:hover { 
    background: #ffb300; 
  }`;

        const bodyContent = `
  <div id="gameContainer">
    ${this.getBackButtonHtml()}
    <div id="score">Score: 0</div>
    <div id="player"></div>
    <div id="controls">A/D or ←/→ move • Space to jump</div>
  </div>`;

        const scripts = `
${this.getBackButtonScript()}
${this.getScoreSavingScript()}

class SubwaySurfersGame {
  constructor() {
    this.player = document.getElementById('player');
    this.gameContainer = document.getElementById('gameContainer');
    this.scoreElement = document.getElementById('score');
    this.lanes = [16.66, 50, 83.33]; // percent positions of centers
    this.playerLane = 1;
    this.score = 0;
    this.baseSpeed = 2.2;
    this.gameSpeed = this.baseSpeed;
    this.obstacles = [];
    this.coins = [];
    this.isJumping = false;
    this.verticalVelocity = 0; // for smooth jump
    this.jumpY = 0;
    this.isGameOver = false;
    this.spawnTimer = 0;
    this.trackOffset = 0; // background scroll

    this.updatePlayerPosition();
    this.bindEvents();
    this.loop();
    this.scheduleSpawn();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (this.isGameOver) return;
      switch (e.code) {
        case 'KeyA': case 'ArrowLeft': this.moveLeft(); break;
        case 'KeyD': case 'ArrowRight': this.moveRight(); break;
        case 'Space': e.preventDefault(); this.jump(); break;
      }
    });
  }

  moveLeft() { if (this.playerLane > 0) { this.playerLane--; this.updatePlayerPosition(); } }
  moveRight() { if (this.playerLane < 2) { this.playerLane++; this.updatePlayerPosition(); } }

  updatePlayerPosition() { this.player.style.left = this.lanes[this.playerLane] + '%'; }

  jump() {
    if (this.isJumping) return;
    this.isJumping = true;
    this.verticalVelocity = 11.5; // initial jump velocity
  }

  scheduleSpawn() {
    if (this.isGameOver) return;
    // 70% obstacle train/box, 50% coin
    if (Math.random() < 0.7) this.createObstacle();
    if (Math.random() < 0.5) this.createCoin();
    const next = 900 + Math.random() * 700;
    setTimeout(() => this.scheduleSpawn(), next);
  }

  createObstacle() {
    const isTrain = Math.random() < 0.25;
    const el = document.createElement('div');
    el.className = isTrain ? 'train' : 'obstacle';
    el.style.left = this.lanes[Math.floor(Math.random() * 3)] + '%';
    el.style.top = '-140px';
    el.style.transform = 'translateX(-50%)';
    this.gameContainer.appendChild(el);
    this.obstacles.push(el);
  }

  createCoin() {
    const c = document.createElement('div');
    c.className = 'coin';
    c.style.left = this.lanes[Math.floor(Math.random() * 3)] + '%';
    c.style.top = '-40px';
    c.style.transform = 'translateX(-50%)';
    this.gameContainer.appendChild(c);
    this.coins.push(c);
  }

  loop() {
    if (this.isGameOver) return;
    this.moveItems();
    this.applyJumpPhysics();
    this.checkCollisions();
    this.cleanup();

    this.score += 1;
    this.scoreElement.textContent = 'Score: ' + this.score;
    if (this.score % 500 === 0) this.gameSpeed += 0.25;

    requestAnimationFrame(() => this.loop());
  }

  applyJumpPhysics() {
    if (this.isJumping) {
      this.jumpY += this.verticalVelocity;
      this.verticalVelocity -= 0.7; // gravity
      if (this.jumpY <= 0) { this.jumpY = 0; this.isJumping = false; this.verticalVelocity = 0; }
      this.player.style.transform = 'translateX(-50%) translateY(' + (-this.jumpY) + 'px)';
    } else {
      this.player.style.transform = 'translateX(-50%) translateY(0)';
    }
  }

  moveItems() {
    [...this.obstacles, ...this.coins].forEach(el => {
      const y = parseFloat(el.dataset.y || '-50');
      const ny = y + this.gameSpeed;
      el.dataset.y = String(ny);
      el.style.top = ny + 'px';
    });
    this.trackOffset += this.gameSpeed;
    this.gameContainer.style.backgroundPositionY = this.trackOffset + 'px';
  }

  checkCollisions() {
    const p = this.player.getBoundingClientRect();
    this.obstacles.forEach(o => {
      const r = o.getBoundingClientRect();
      if (this.rectsOverlap(p, r) && !this.isJumping) this.endGame();
    });
    this.coins.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      if (this.rectsOverlap(p, r)) { c.remove(); this.coins.splice(i,1); this.score += 15; }
    });
  }

  rectsOverlap(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  cleanup() {
    this.obstacles = this.obstacles.filter(o => {
      if ((parseFloat(o.dataset.y || '0')) > window.innerHeight + 50) { o.remove(); return false; }
      return true;
    });
    this.coins = this.coins.filter(c => {
      if ((parseFloat(c.dataset.y || '0')) > window.innerHeight + 50) { c.remove(); return false; }
      return true;
    });
  }

  endGame() {
    this.isGameOver = true;
    saveScore(this.score);
    
    const overlay = document.createElement('div');
    overlay.className = 'game-over';
    const title = document.createElement('h2');
    title.textContent = 'Game Over!';
    const p = document.createElement('p');
    p.textContent = 'Final Score: ' + this.score;
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Play Again';
    btn.addEventListener('click', () => this.reset());
    overlay.appendChild(title); overlay.appendChild(p); overlay.appendChild(btn);
    this.gameContainer.appendChild(overlay);
  }

  reset() {
    this.obstacles.forEach(o => o.remove());
    this.coins.forEach(c => c.remove());
    this.obstacles = []; this.coins = [];
    const overlay = this.gameContainer.querySelector('.game-over');
    if (overlay) overlay.remove();
    this.score = 0; this.gameSpeed = this.baseSpeed; this.isGameOver = false; this.jumpY = 0; this.verticalVelocity = 0; this.playerLane = 1; this.updatePlayerPosition();
    this.loop();
    this.scheduleSpawn();
  }
}

const subwayGame = new SubwaySurfersGame();`;

        return getBasicHtmlTemplate(webview, nonce, 'Subway Surfers') + `
<style>
${styles}
</style>
</head>
<body>
${bodyContent}
<script nonce="${nonce}">
${scripts}
</script>
</body>
</html>`;
    }
}
