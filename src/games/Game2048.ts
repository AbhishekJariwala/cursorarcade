import * as vscode from 'vscode';
import { BaseGame } from './GameInterface';
import { getNonce, getBasicHtmlTemplate } from '../utils/WebviewUtils';

export class Game2048 extends BaseGame {
    getName(): string { return "2048"; }
    getIcon(): string { return "🔢"; }
    getDescription(): string { return "Merge tiles to reach 2048"; }
    getId(): string { return "2048"; }

    getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const nonce = getNonce();
        
        const styles = `
  body { 
    margin: 0; 
    padding: 0; 
    background: #faf8ef; 
    font-family: -apple-system, Segoe UI, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .title {
    font-size: 48px;
    font-weight: bold;
    color: #776e65;
    margin: 0;
  }
  .scores {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  .score-box {
    background: #bbada0;
    padding: 10px 20px;
    border-radius: 6px;
    color: white;
    text-align: center;
  }
  .score-label {
    font-size: 14px;
    text-transform: uppercase;
  }
  .score-value {
    font-size: 20px;
    font-weight: bold;
  }
  #gameContainer {
    background: #bbada0;
    padding: 15px;
    border-radius: 6px;
    position: relative;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    background: #bbada0;
  }
  .cell {
    width: 80px;
    height: 80px;
    background: #cdc1b4;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    color: #776e65;
    transition: all 0.15s ease;
  }
  .tile-2 { background: #eee4da; }
  .tile-4 { background: #ede0c8; }
  .tile-8 { background: #f2b179; color: #f9f6f2; }
  .tile-16 { background: #f59563; color: #f9f6f2; }
  .tile-32 { background: #f67c5f; color: #f9f6f2; }
  .tile-64 { background: #f65e3b; color: #f9f6f2; }
  .tile-128 { background: #edcf72; color: #f9f6f2; font-size: 28px; }
  .tile-256 { background: #edcc61; color: #f9f6f2; font-size: 28px; }
  .tile-512 { background: #edc850; color: #f9f6f2; font-size: 28px; }
  .tile-1024 { background: #edc53f; color: #f9f6f2; font-size: 24px; }
  .tile-2048 { background: #edc22e; color: #f9f6f2; font-size: 24px; }
  .controls {
    margin-top: 20px;
    text-align: center;
    color: #776e65;
  }
  .game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(238, 228, 218, 0.95);
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    border: 2px solid #776e65;
  }`;

        const bodyContent = `
  ${this.getBackButtonHtml()}
  <div class="header">
    <h1 class="title">2048</h1>
    <div class="scores">
      <div class="score-box">
        <div class="score-label">Score</div>
        <div class="score-value" id="score">0</div>
      </div>
      <div class="score-box">
        <div class="score-label">Best</div>
        <div class="score-value" id="best">0</div>
      </div>
    </div>
  </div>
  
  <div id="gameContainer">
    <div class="grid" id="grid"></div>
  </div>
  
  <div class="controls">Use arrow keys or WASD to move tiles</div>`;

        const scripts = `
${this.getBackButtonScript()}
${this.getScoreSavingScript()}

class Game2048 {
  constructor() {
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.best = parseInt(localStorage.getItem('2048-best') || '0');
    this.gameOver = false;
    
    this.init();
    this.bindEvents();
    this.updateDisplay();
  }
  
  init() {
    this.addRandomTile();
    this.addRandomTile();
  }
  
  addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) {
          emptyCells.push({i, j});
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const {i, j} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }
  
  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (this.gameOver) return;
      
      let moved = false;
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          moved = this.moveUp();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          moved = this.moveDown();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          moved = this.moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moved = this.moveRight();
          break;
      }
      
      if (moved) {
        this.addRandomTile();
        this.updateDisplay();
        
        if (this.checkGameOver()) {
          this.endGame();
        }
      }
    });
  }
  
  moveLeft() {
    return this.move(row => row);
  }
  
  moveRight() {
    return this.move(row => row.reverse());
  }
  
  moveUp() {
    return this.move(col => this.getColumn(col));
  }
  
  moveDown() {
    return this.move(col => this.getColumn(col).reverse());
  }
  
  getColumn(colIndex) {
    return this.grid.map(row => row[colIndex]);
  }
  
  setColumn(colIndex, col) {
    for (let i = 0; i < 4; i++) {
      this.grid[i][colIndex] = col[i];
    }
  }
  
  move(getLine) {
    let moved = false;
    
    for (let i = 0; i < 4; i++) {
      let line = getLine(i);
      const originalLine = [...line];
      
      // Merge tiles
      line = this.mergeLine(line);
      
      // Fill with zeros
      while (line.length < 4) {
        line.push(0);
      }
      
      // Check if anything moved
      if (JSON.stringify(originalLine) !== JSON.stringify(line)) {
        moved = true;
      }
      
      // Update the grid
      if (getLine === this.getColumn) {
        this.setColumn(i, line);
      } else {
        this.grid[i] = line;
      }
    }
    
    return moved;
  }
  
  mergeLine(line) {
    // Remove zeros
    line = line.filter(tile => tile !== 0);
    
    // Merge adjacent tiles
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i + 1]) {
        line[i] *= 2;
        this.score += line[i];
        line.splice(i + 1, 1);
      }
    }
    
    return line;
  }
  
  updateDisplay() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        
        if (this.grid[i][j] !== 0) {
          cell.textContent = this.grid[i][j];
          cell.classList.add('tile-' + this.grid[i][j]);
        }
        
        gridElement.appendChild(cell);
      }
    }
    
    document.getElementById('score').textContent = this.score;
    document.getElementById('best').textContent = Math.max(this.best, this.score);
    
    // Check for win condition (2048 tile)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 2048) {
          this.win();
          return;
        }
      }
    }
  }
  
  checkGameOver() {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) return false;
      }
    }
    
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.grid[i][j];
        if ((i < 3 && this.grid[i + 1][j] === current) ||
            (j < 3 && this.grid[i][j + 1] === current)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  endGame() {
    this.gameOver = true;
    this.best = Math.max(this.best, this.score);
    localStorage.setItem('2048-best', this.best.toString());
    saveScore(this.score);
    
    const overlay = document.createElement('div');
    overlay.className = 'game-over';
    overlay.innerHTML = \`
      <h2>Game Over!</h2>
      <p>Final Score: \${this.score}</p>
      <button class="btn" onclick="game2048.reset()">Play Again</button>
    \`;
    document.getElementById('gameContainer').appendChild(overlay);
  }

  win() {
    this.gameOver = true;
    this.best = Math.max(this.best, this.score);
    localStorage.setItem('2048-best', this.best.toString());
    saveScore(this.score);
    
    const overlay = document.createElement('div');
    overlay.className = 'game-over';
    overlay.innerHTML = \`
      <h2>🎉 You Won! 🎉</h2>
      <p>You reached 2048!</p>
      <p>Final Score: \${this.score}</p>
      <button class="btn" onclick="game2048.reset()">Play Again</button>
    \`;
    document.getElementById('gameContainer').appendChild(overlay);
  }

  reset() {
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    
    const overlay = document.getElementById('gameContainer').querySelector('.game-over');
    if (overlay) overlay.remove();
    
    this.init();
    this.updateDisplay();
  }
}

const game2048 = new Game2048();`;

        return getBasicHtmlTemplate(webview, nonce, '2048 Game') + `
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
