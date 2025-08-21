import * as vscode from 'vscode';
import { BaseGame } from './GameInterface';
import { getNonce, getBasicHtmlTemplate } from '../utils/WebviewUtils';

export class SubwaySurfersGame extends BaseGame {
    getName(): string { return "Pixel Runner"; }
    getIcon(): string { return "█"; }
    getDescription(): string { return "Retro arcade endless runner"; }
    getId(): string { return "subwaySurfers"; }

    getHtml(webview: vscode.Webview, extensionUri: vscode.Uri, viewType?: string): string {
        const nonce = getNonce();
        
        // Responsive design variables
        const isSidebar = this.isSidebarMode(viewType);
        const isBottomPanel = this.isBottomPanelMode(viewType);
        
        const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap');
  
  :root { --lane-count: 3; }
  
  body { 
    margin: 0; 
    padding: 0; 
    background: #151110; 
    font-family: 'Fira Mono', monospace; 
    color: #FFFFFF;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  #gameContainer {
    width: 100%; 
    height: ${isSidebar ? '400px' : '100vh'}; 
    max-height: ${isSidebar ? '400px' : '600px'}; 
    position: relative; 
    overflow: hidden; 
    margin: 0 auto;
    background: 
      repeating-linear-gradient(
        0deg,
        #201E1C 0px,
        #201E1C 2px,
        #151110 2px,
        #151110 20px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0%,
        transparent 32%,
        #DBDFDF 32%,
        #DBDFDF 34%,
        transparent 34%,
        transparent 66%,
        #DBDFDF 66%,
        #DBDFDF 68%,
        transparent 68%
      );
    border: 3px solid #DBDFDF;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  /* CRT scan lines effect */
  #gameContainer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.1) 2px,
      rgba(0, 0, 0, 0.1) 4px
    );
    pointer-events: none;
    z-index: 1000;
  }
  
  #player { 
    width: 32px; 
    height: 32px; 
    background: #FFFFFF; 
    border: 3px solid #201E1C;
    position: absolute; 
    bottom: 68px; 
    left: 50%; 
    transform: translateX(-50%); 
    z-index: 10; 
    font-family: monospace;
    font-size: 24px;
    line-height: 26px;
    text-align: center;
    color: #201E1C;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  #player::before {
    content: "♠";
    display: block;
  }
  
  .obstacle { 
    width: 32px; 
    height: 48px; 
    background: #201E1C; 
    border: 3px solid #FFFFFF;
    position: absolute; 
    font-family: monospace;
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    color: #FFFFFF;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  .obstacle::before {
    content: "■\\A■";
    white-space: pre;
    display: block;
  }
  
  .train { 
    width: 32px; 
    height: 80px; 
    background: #201E1C; 
    border: 3px solid #FFFFFF;
    position: absolute; 
    font-family: monospace;
    font-size: 18px;
    line-height: 18px;
    text-align: center;
    color: #FFFFFF;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  .train::before {
    content: "■\\A■\\A■\\A■";
    white-space: pre;
    display: block;
  }
  
  .wall { 
    width: 32px; 
    height: 64px; 
    background: #201E1C; 
    border: 3px solid #FFFFFF;
    position: absolute; 
    font-family: monospace;
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    color: #FFFFFF;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  .wall::before {
    content: "■\\A■\\A■";
    white-space: pre;
    display: block;
  }
  
  .spike { 
    width: 32px; 
    height: 32px; 
    background: #201E1C; 
    border: 3px solid #FFFFFF;
    position: absolute; 
    font-family: monospace;
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    color: #FFFFFF;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  .spike::before {
    content: "▲";
    display: block;
  }
  
  .barrier { 
    width: 64px; 
    height: 48px; 
    background: #201E1C; 
    border: 3px solid #FFFFFF;
    position: absolute; 
    font-family: monospace;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    color: #FFFFFF;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  .barrier::before {
    content: "═══\\A═══";
    white-space: pre;
    display: block;
  }
  
  .coin { 
    width: 20px; 
    height: 20px; 
    background: #DBDFDF; 
    border: 3px solid #201E1C;
    border-radius: 50%;
    position: absolute; 
    font-family: monospace;
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    color: #201E1C;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  .coin::before {
    content: "○";
    display: block;
  }
  
  .gold-coin { 
    width: 24px; 
    height: 24px; 
    background: #DBDFDF; 
    border: 3px solid #201E1C;
    border-radius: 50%;
    position: absolute; 
    font-family: monospace;
    font-size: 16px;
    line-height: 18px;
    text-align: center;
    color: #201E1C;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  .gold-coin::before {
    content: "◉";
    display: block;
  }
  
  .gem { 
    width: 22px; 
    height: 22px; 
    background: #DBDFDF; 
    border: 3px solid #201E1C;
    position: absolute; 
    font-family: monospace;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    color: #201E1C;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    transform: rotate(45deg);
  }
  
  .gem::before {
    content: "◆";
    display: block;
  }
  
  #score { 
    position: absolute; 
    top: 20px; 
    left: 20px; 
    color: #FFFFFF; 
    font-weight: normal; 
    z-index: 100; 
    font-size: 1.2em; 
    background: #201E1C;
    padding: 10px 15px;
    border: 2px solid #DBDFDF;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  
  #controls { 
    position: absolute; 
    bottom: 20px; 
    left: 50%; 
    transform: translateX(-50%); 
    color: #FFFFFF; 
    text-align: center; 
    font-size: 0.9em; 
    z-index: 100; 
    background: #201E1C; 
    padding: 12px 20px; 
    border: 2px solid #DBDFDF;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  .game-over {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(21, 17, 16, 0.95);
    color: #FFFFFF;
    padding: 40px;
    border: 3px solid #DBDFDF;
    text-align: center;
    font-family: 'Courier New', monospace;
    z-index: 1000;
  }
  
  .game-over h2 {
    color: #DBDFDF;
    margin-bottom: 20px;
    font-size: 1.8em;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  
  .game-over button {
    background: #201E1C;
    color: #FFFFFF;
    border: 2px solid #DBDFDF;
    padding: 12px 24px;
    font-family: 'Courier New', monospace;
    font-size: 1em;
    cursor: pointer;
    margin: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .game-over button:hover {
    background: #DBDFDF;
    color: #151110;
  }
  
  .play-again-btn {
    background: #201E1C;
    color: #FFFFFF;
    border: 2px solid #DBDFDF;
    padding: 12px 24px;
    font-family: 'Courier New', monospace;
    font-size: 1em;
    cursor: pointer;
    margin: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .play-again-btn:hover {
    background: #DBDFDF;
    color: #151110;
  }
  
  .back-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #201E1C;
    color: #FFFFFF;
    border: 2px solid #DBDFDF;
    padding: 10px 20px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    cursor: pointer;
    z-index: 1000;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .back-btn:hover {
    background: #DBDFDF;
    color: #151110;
  }
  
  .points-popup {
    position: absolute;
    color: #DBDFDF;
    font-family: 'Courier New', monospace;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    pointer-events: none;
    z-index: 200;
    animation: pointsFloat 1s ease-out forwards;
  }
  
  @keyframes pointsFloat {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-40px);
    }
  }`;

        const bodyContent = `
  <div id="gameContainer">
    ${this.getBackButtonHtml()}
    <div id="score">Score: 0</div>
    <div id="player"></div>
    <div id="controls">A/D Move • Space Jump • Collect Coins for Points!</div>
  </div>`;

        const scripts = `
${this.getBackButtonScript()}
${this.getScoreSavingScript()}

class PixelRunnerGame {
  constructor() {
    this.player = document.getElementById('player');
    this.gameContainer = document.getElementById('gameContainer');
    this.scoreElement = document.getElementById('score');
    this.lanes = [16.66, 50, 83.33]; // percent positions of centers
    this.playerLane = 1;
    this.score = 0;
    this.baseSpeed = 2.5; // Faster base speed
    this.gameSpeed = this.baseSpeed;
    this.obstacles = [];
    this.coins = [];
    this.isJumping = false;
    this.jumpStage = 0; // 0 = ground, 1 = jumping, 2 = falling
    this.jumpDuration = 0;
    this.isGameOver = false;
    this.spawnTimer = 0;
    this.trackOffset = 0;
    this.gameTitle = 'PIXEL RUNNER';

    this.updatePlayerPosition();
    this.bindEvents();
    this.loop();
    this.scheduleSpawn();
  }

  bindEvents() {
    // Use a hidden input to capture keyboard events properly
    const keyboardInput = document.createElement('input');
    keyboardInput.type = 'text';
    keyboardInput.style.position = 'absolute';
    keyboardInput.style.top = '-9999px';
    keyboardInput.style.left = '-9999px';
    keyboardInput.tabIndex = 0;
    keyboardInput.autocomplete = 'off';
    document.body.appendChild(keyboardInput);
    keyboardInput.focus();
    
    document.addEventListener('keydown', (e) => {
      if (this.isGameOver) return;
      switch (e.code) {
        case 'KeyA': 
        case 'ArrowLeft': 
          e.preventDefault();
          e.stopPropagation();
          this.moveLeft(); 
          break;
        case 'KeyD': 
        case 'ArrowRight': 
          e.preventDefault();
          e.stopPropagation();
          this.moveRight(); 
          break;
        case 'Space': 
          e.preventDefault(); 
          this.jump(); 
          break;
      }
    });
    
    // Ensure the hidden input stays focused for keyboard input
    document.addEventListener('click', () => {
      keyboardInput.focus();
    });
    
    // Prevent focus loss
    document.addEventListener('blur', () => {
      setTimeout(() => keyboardInput.focus(), 0);
    });
    
    keyboardInput.addEventListener('blur', () => {
      setTimeout(() => keyboardInput.focus(), 0);
    });
  }

  moveLeft() { 
    if (this.playerLane > 0) { 
      this.playerLane--; 
      this.updatePlayerPosition(); 
    } 
  }
  
  moveRight() { 
    if (this.playerLane < 2) { 
      this.playerLane++; 
      this.updatePlayerPosition(); 
    } 
  }

  updatePlayerPosition() { 
    // Instant movement - no transition
    this.player.style.left = this.lanes[this.playerLane] + '%';
    this.player.style.transition = 'none';
  }

  jump() {
    if (this.isJumping) return;
    this.isJumping = true;
    this.jumpStage = 1;
    this.jumpDuration = 0;
    this.player.style.transform = 'translateX(-50%) translateY(-80px)'; // Higher jump!
  }

  scheduleSpawn() {
    if (this.isGameOver) return;
    
    // Calculate difficulty based on score
    const difficultyLevel = Math.floor(this.score / 500); // Increase every 500 points
    const maxDifficulty = 8; // Cap difficulty to avoid impossible situations
    const currentDifficulty = Math.min(difficultyLevel, maxDifficulty);
    
    // Obstacle probability increases with difficulty (but capped to avoid impossible situations)
    const obstacleChance = Math.min(0.5 + (currentDifficulty * 0.05), 0.8); // 50% to 80% max
    // Coin probability stays high to maintain scoring opportunities
    const coinChance = 0.75; // Consistent coin spawning
    
    if (Math.random() < obstacleChance) this.createObstacle();
    if (Math.random() < coinChance) {
      // 40% chance for coin train, 60% for single coin
      if (Math.random() < 0.4) {
        this.createCoinTrain();
      } else {
        this.createCoin();
      }
    }
    
    // Spawn frequency increases with difficulty (shorter intervals = more frequent)
    const baseInterval = 1500;
    const minInterval = 800; // Minimum interval to avoid impossible situations
    const interval = Math.max(baseInterval - (currentDifficulty * 100), minInterval);
    
    setTimeout(() => this.scheduleSpawn(), interval);
  }

  createObstacle() {
    const obstacleTypes = ['obstacle', 'train', 'wall', 'spike', 'barrier'];
    const weights = [0.3, 0.2, 0.2, 0.15, 0.15]; // Probability weights
    
    // Weighted random selection
    let random = Math.random();
    let selectedType = 'obstacle';
    for (let i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        selectedType = obstacleTypes[i];
        break;
      }
      random -= weights[i];
    }
    
    const el = document.createElement('div');
    el.className = selectedType;
    el.style.left = this.lanes[Math.floor(Math.random() * 3)] + '%';
    
    // Adjust spawn height based on obstacle type
    let spawnHeight = '-140px';
    if (selectedType === 'spike') spawnHeight = '-40px'; // Spikes closer to ground
    if (selectedType === 'barrier') spawnHeight = '-60px'; // Barriers closer to ground
    
    el.style.top = spawnHeight;
    el.style.transform = 'translateX(-50%)';
    this.gameContainer.appendChild(el);
    this.obstacles.push(el);
    
    // Create obstacle patterns based on difficulty (but capped for safety)
    const difficultyLevel = Math.floor(this.score / 500);
    const patternChance = Math.min(0.1 + (difficultyLevel * 0.02), 0.25); // 10% to 25% max
    
    if (Math.random() < patternChance) {
      setTimeout(() => {
        if (!this.isGameOver) {
          this.createObstaclePattern(selectedType);
        }
      }, 300); // Slightly longer delay for safety
    }
  }
  
  createObstaclePattern(baseType) {
    // Ensure patterns never block all lanes
    const maxPatternLength = 2; // Maximum 2 obstacles to always leave 1 lane open
    const patternLength = Math.floor(Math.random() * maxPatternLength) + 1; // 1-2 obstacles
    const baseLane = Math.floor(Math.random() * 3);
    
    for (let i = 0; i < patternLength; i++) {
      const laneIndex = (baseLane + i) % 3;
      // Skip if this would be the third lane in a row (keeps one lane always open)
      if (i >= 2) break;
      
      const el = document.createElement('div');
      el.className = baseType;
      el.style.left = this.lanes[laneIndex] + '%';
      el.style.top = '-140px';
      el.style.transform = 'translateX(-50%)';
      this.gameContainer.appendChild(el);
      this.obstacles.push(el);
    }
  }

  createCoin() {
    const coinTypes = ['coin', 'gold-coin', 'gem'];
    const weights = [0.7, 0.25, 0.05]; // Regular coins most common, gems rarest
    
    // Weighted random selection
    let random = Math.random();
    let selectedType = 'coin';
    for (let i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        selectedType = coinTypes[i];
        break;
      }
      random -= weights[i];
    }
    
    const c = document.createElement('div');
    c.className = selectedType;
    c.dataset.coinType = selectedType; // Store type for scoring
    
    // Don't spawn coins on top of obstacles - check for clear lanes
    const availableLanes = this.getAvailableLanes();
    const selectedLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
    
    // Vary spawn height for visual interest
    const heights = ['-40px', '-60px', '-80px'];
    const randomHeight = heights[Math.floor(Math.random() * heights.length)];
    
    c.style.left = this.lanes[selectedLane] + '%';
    c.style.top = randomHeight;
    c.style.transform = 'translateX(-50%)';
    this.gameContainer.appendChild(c);
    this.coins.push(c);
  }
  
  createCoinTrain() {
    // Create 5 coins in a row like Subway Surfers
    const selectedLane = Math.floor(Math.random() * 3);
    const coinType = 'coin'; // Coin trains are always regular coins
    
    for (let i = 0; i < 5; i++) {
      const c = document.createElement('div');
      c.className = coinType;
      c.dataset.coinType = coinType;
      
      c.style.left = this.lanes[selectedLane] + '%';
      c.style.top = (-40 - (i * 60)) + 'px'; // Spaced 60px apart vertically
      c.style.transform = 'translateX(-50%)';
      this.gameContainer.appendChild(c);
      this.coins.push(c);
    }
  }
  
  getAvailableLanes() {
    // Check which lanes don't have obstacles near the spawn area
    const recentObstacles = this.obstacles.filter(obs => {
      const top = parseFloat(obs.style.top || '0');
      return top > -200 && top < 0; // Check spawn area
    });
    
    const blockedLanes = new Set();
    recentObstacles.forEach(obs => {
      const left = parseFloat(obs.style.left || '0');
      // Find which lane this obstacle is in
      for (let i = 0; i < this.lanes.length; i++) {
        if (Math.abs(left - this.lanes[i]) < 10) {
          blockedLanes.add(i);
          break;
        }
      }
    });
    
    // Return available lanes, or all lanes if none are available
    const available = [];
    for (let i = 0; i < 3; i++) {
      if (!blockedLanes.has(i)) {
        available.push(i);
      }
    }
    
    return available.length > 0 ? available : [0, 1, 2];
  }

  loop() {
    if (this.isGameOver) return;
    this.moveItems();
    this.applyJumpPhysics();
    this.checkCollisions();
    this.cleanup();

    // No points for just running - only coins give points!
    this.scoreElement.textContent = 'Score: ' + this.score;
    // Keep speed constant - difficulty increases through obstacle frequency

    requestAnimationFrame(() => this.loop());
  }

  applyJumpPhysics() {
    if (this.isJumping) {
      this.jumpDuration++;
      // Longer jump duration for more forgiving gameplay
      if (this.jumpDuration >= 30) {
        this.isJumping = false;
        this.jumpStage = 0;
        this.jumpDuration = 0;
        this.player.style.transform = 'translateX(-50%) translateY(0)';
      }
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
      if (this.rectsOverlap(p, r)) { 
        const coinType = c.dataset.coinType || 'coin';
        let points = 100; // Default coin value
        
        // Different points for different coin types
        if (coinType === 'gold-coin') points = 250;
        else if (coinType === 'gem') points = 500;
        
        c.remove(); 
        this.coins.splice(i,1); 
        this.score += points;
        
        // Increase speed by 0.05 for each coin (5ms equivalent)
        this.gameSpeed += 0.05;
        
        // Show points popup
        this.showPointsPopup(points, r.left, r.top);
      }
    });
  }

  rectsOverlap(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }
  
  showPointsPopup(points, x, y) {
    const popup = document.createElement('div');
    popup.className = 'points-popup';
    popup.textContent = '+' + points;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    document.body.appendChild(popup);
    
    // Remove popup after animation
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 1000);
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
    title.textContent = 'GAME OVER';
    const p = document.createElement('p');
    p.textContent = 'FINAL SCORE: ' + this.score;
    const btn = document.createElement('button');
    btn.className = 'play-again-btn';
    btn.textContent = 'PLAY AGAIN';
    btn.addEventListener('click', () => this.reset());
    overlay.appendChild(title); overlay.appendChild(p); overlay.appendChild(btn);
    document.body.appendChild(overlay); // Fixed positioning
  }

  reset() {
    this.obstacles.forEach(o => o.remove());
    this.coins.forEach(c => c.remove());
    this.obstacles = []; this.coins = [];
    const overlay = document.body.querySelector('.game-over');
    if (overlay) overlay.remove();
    this.score = 0; 
    this.gameSpeed = this.baseSpeed; // Always reset to constant base speed 
    this.isGameOver = false; 
    this.jumpStage = 0;
    this.jumpDuration = 0;
    this.isJumping = false;
    this.playerLane = 1; 
    this.updatePlayerPosition();
    this.player.style.transform = 'translateX(-50%) translateY(0)';
    this.loop();
    this.scheduleSpawn();
  }
}

const pixelRunnerGame = new PixelRunnerGame();`;

        return getBasicHtmlTemplate(webview, nonce, 'Pixel Runner') + `
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
