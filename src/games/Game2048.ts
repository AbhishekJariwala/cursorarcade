import * as vscode from 'vscode';
import { BaseGame } from './GameInterface';
import { getNonce, getBasicHtmlTemplate } from '../utils/WebviewUtils';

export class Game2048 extends BaseGame {
    getName(): string { return "2048"; }
    getIcon(): string { return "🔢"; }
    getDescription(): string { return "Merge tiles to reach 2048"; }
    getId(): string { return "2048"; }

    getHtml(webview: vscode.Webview, extensionUri: vscode.Uri, viewType?: string): string {
        const nonce = getNonce();
        
        // Responsive design variables
        const isSidebar = this.isSidebarMode(viewType);
        const isBottomPanel = this.isBottomPanelMode(viewType);
        
        const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap');
  
  body { 
    margin: 0; 
    padding: 0; 
    background: #151110; 
    font-family: 'Fira Mono', monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    color: #FFFFFF;
  }
  
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .title {
    font-size: ${isSidebar ? '2em' : '3em'};
    font-weight: 700;
    color: #FFFFFF;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    letter-spacing: ${isSidebar ? '1px' : '2px'};
    margin-bottom: 10px;
  }
  
  .subtitle {
    font-size: 1em;
    color: #DBDFDF;
    opacity: 0.8;
    margin-bottom: 20px;
  }
  
  .scores {
    display: flex;
    ${isSidebar ? 'flex-direction: column;' : ''}
    gap: ${isSidebar ? '10px' : '20px'};
    margin-bottom: 30px;
  }
  
  .score-box {
    background: #201E1C;
    border: 2px solid #DBDFDF;
    padding: 15px 25px;
    border-radius: 8px;
    color: #FFFFFF;
    text-align: center;
    min-width: 100px;
  }
  
  .score-label {
    font-size: 0.8em;
    text-transform: uppercase;
    color: #DBDFDF;
    margin-bottom: 5px;
    letter-spacing: 1px;
  }
  
  .score-value {
    font-size: 1.5em;
    font-weight: 700;
    color: #FFFFFF;
  }
  
  #gameContainer {
    background: #201E1C;
    padding: 20px;
    border-radius: 12px;
    border: 3px solid #DBDFDF;
    position: relative;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    background: #201E1C;
  }
  
  .cell {
    width: ${isSidebar ? '50px' : '70px'};
    height: ${isSidebar ? '50px' : '70px'};
    background: #2A2826;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${isSidebar ? '1.2em' : '1.5em'};
    font-weight: 700;
    color: #FFFFFF;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    font-family: 'Fira Mono', monospace;
  }
  
  .cell:hover {
    border-color: #DBDFDF;
    transform: scale(1.05);
  }
  
  .tile-2 { background: #DBDFDF; color: #151110; }
  .tile-4 { background: #201E1C; color: #FFFFFF; }
  .tile-8 { background: #C5CACA; color: #151110; }
  .tile-16 { background: #1B1A18; color: #FFFFFF; }
  .tile-32 { background: #F0F2F2; color: #151110; }
  .tile-64 { background: #141312; color: #FFFFFF; }
  .tile-128 { background: #E8EAEA; color: #151110; font-size: 1.3em; }
  .tile-256 { background: #0F0E0D; color: #FFFFFF; font-size: 1.3em; }
  .tile-512 { background: #B8BDBD; color: #151110; font-size: 1.3em; }
  .tile-1024 { background: #252420; color: #FFFFFF; font-size: 1.1em; }
  .tile-2048 { background: #FFFFFF; color: #151110; font-size: 1.1em; font-weight: bold; }
  
  .controls {
    margin-top: 30px;
    text-align: center;
    color: #DBDFDF;
    font-size: 0.9em;
  }
  
  .game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(20, 30, 16, 0.95);
    color: #FFFFFF;
    padding: 40px;
    border-radius: 12px;
    text-align: center;
    border: 3px solid #DBDFDF;
    font-family: 'Fira Mono', monospace;
    box-shadow: 0 12px 32px rgba(0,0,0,0.5);
  }
  
  .game-over h2 {
    color: #DBDFDF;
    margin-bottom: 20px;
    font-size: 1.8em;
  }
  
  .game-over button {
    background: #201E1C;
    color: #FFFFFF;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Fira Mono', monospace;
    font-size: 1em;
    cursor: pointer;
    margin: 10px;
    transition: all 0.2s ease;
  }
  
  .game-over button:hover {
    background: #DBDFDF;
    color: #151110;
    transform: translateY(-2px);
  }
  
  .play-again-btn {
    background: #201E1C;
    color: #FFFFFF;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Fira Mono', monospace;
    font-size: 1em;
    cursor: pointer;
    margin: 10px;
    transition: all 0.2s ease;
  }
  
  .play-again-btn:hover {
    background: #DBDFDF;
    color: #151110;
    transform: translateY(-2px);
  }
  
  .back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: #201E1C;
    color: #FFFFFF;
    border: 2px solid #DBDFDF;
    padding: 10px 20px;
    border-radius: 8px;
    font-family: 'Fira Mono', monospace;
    font-size: 0.9em;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 1000;
  }
  
  .back-btn:hover {
    background: #2A2826;
    border-color: #FFFFFF;
    transform: translateY(-2px);
  }`;

        const bodyContent = `
  ${this.getBackButtonHtml()}
  <div class="header">
    <h1 class="title">2048</h1>
    <div class="subtitle">Merge tiles to reach 2048!</div>
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
      <button class="play-again-btn" id="playAgainBtn">Play Again</button>
    \`;
    document.getElementById('gameContainer').appendChild(overlay);
    
    // Add event listener to the play again button
    const playAgainBtn = overlay.querySelector('#playAgainBtn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => this.reset());
    }
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
      <button class="play-again-btn" id="playAgainBtnWin">Play Again</button>
    \`;
    document.getElementById('gameContainer').appendChild(overlay);
    
    // Add event listener to the play again button
    const playAgainBtn = overlay.querySelector('#playAgainBtnWin');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => this.reset());
    }
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
