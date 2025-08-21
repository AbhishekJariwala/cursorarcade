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
    outline: none;
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
    z-index: 1;
  }
  
  .grid {
    position: relative;
    width: ${isSidebar ? '232px' : '322px'};
    height: ${isSidebar ? '232px' : '322px'};
    background: #201E1C;
    border-radius: 8px;
    padding: 12px;
    z-index: 1;
  }
  
  .grid-cell {
    position: absolute;
    width: ${isSidebar ? '50px' : '70px'};
    height: ${isSidebar ? '50px' : '70px'};
    background: #2A2826;
    border-radius: 8px;
    border: 2px solid transparent;
  }
  
  .tile {
    position: absolute;
    width: ${isSidebar ? '50px' : '70px'};
    height: ${isSidebar ? '50px' : '70px'};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${isSidebar ? '1.2em' : '1.5em'};
    font-weight: 700;
    color: #FFFFFF;
    font-family: 'Fira Mono', monospace;
    transition: all 0.3s ease-in-out;
    z-index: 10;
    border: 2px solid transparent;
  }
  
  .tile.new-tile {
    animation: tileSpawn 0.2s ease-in-out;
  }
  
  .tile.merged-tile {
    animation: tileMerge 0.2s ease-in-out;
  }
  
  @keyframes tileSpawn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes tileMerge {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
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
    z-index: 1000;
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
  
  <div class="controls">Use arrow keys or WASD to move tiles</div>
  <div style="position: absolute; top: -9999px; left: -9999px;">
    <input type="text" id="keyboardFocus" tabindex="0" autocomplete="off" />
  </div>`;

        const scripts = `
${this.getBackButtonScript()}
${this.getScoreSavingScript()}

class Game2048 {
  constructor() {
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.best = parseInt(localStorage.getItem('2048-best') || '0');
    this.gameOver = false;
    this.animating = false;
    this.tileIdCounter = 0;
    this.tiles = new Map(); // Map of tile id -> {value, row, col, element, isNew, isMerged}
    this.cellSize = ${isSidebar ? '50' : '70'};
    this.gap = 12;

    this.bindEvents();
    this.initGrid();
    this.init();
    this.updateDisplay();
  }
  
  init() {
    this.addRandomTile();
    this.addRandomTile();
  }
  
  initGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    
    // Create background grid cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const gridCell = document.createElement('div');
        gridCell.className = 'grid-cell';
        gridCell.style.left = (j * (this.cellSize + this.gap)) + 'px';
        gridCell.style.top = (i * (this.cellSize + this.gap)) + 'px';
        gridElement.appendChild(gridCell);
      }
    }
  }
  
  getTilePosition(row, col) {
    return {
      x: col * (this.cellSize + this.gap),
      y: row * (this.cellSize + this.gap)
    };
  }
  
  createTile(value, row, col, isNew = false) {
    const tileId = this.tileIdCounter++;
    const position = this.getTilePosition(row, col);
    
    const tileElement = document.createElement('div');
    tileElement.className = 'tile tile-' + value;
    tileElement.textContent = value;
    tileElement.style.left = position.x + 'px';
    tileElement.style.top = position.y + 'px';
    tileElement.dataset.tileId = tileId.toString();
    
    if (isNew) {
      tileElement.classList.add('new-tile');
      // Remove the animation class after animation completes
      setTimeout(() => {
        tileElement.classList.remove('new-tile');
      }, 200);
    }
    
    document.getElementById('grid').appendChild(tileElement);
    
    this.tiles.set(tileId, {
      value: value,
      row: row,
      col: col,
      element: tileElement,
      isNew: isNew,
      isMerged: false
    });
    
    return tileId;
  }
  
  moveTile(tileId, newRow, newCol) {
    const tile = this.tiles.get(tileId);
    if (!tile) return;
    
    const newPosition = this.getTilePosition(newRow, newCol);
    tile.element.style.left = newPosition.x + 'px';
    tile.element.style.top = newPosition.y + 'px';
    
    tile.row = newRow;
    tile.col = newCol;
  }
  
  mergeTiles(tile1Id, tile2Id, newValue, newRow, newCol) {
    const tile1 = this.tiles.get(tile1Id);
    const tile2 = this.tiles.get(tile2Id);
    
    if (!tile1 || !tile2) return null;
    
    // Move both tiles to the merge position
    this.moveTile(tile1Id, newRow, newCol);
    this.moveTile(tile2Id, newRow, newCol);
    
    // Create new merged tile
    const newTileId = this.createTile(newValue, newRow, newCol, false);
    const newTile = this.tiles.get(newTileId);
    newTile.element.classList.add('merged-tile');
    
    // Remove the animation class after animation completes
    setTimeout(() => {
      newTile.element.classList.remove('merged-tile');
    }, 200);
    
    // Remove old tiles after animation
    setTimeout(() => {
      tile1.element.remove();
      tile2.element.remove();
      this.tiles.delete(tile1Id);
      this.tiles.delete(tile2Id);
    }, 300);
    
    return newTileId;
  }
  
  clearAllTiles() {
    this.tiles.forEach(tile => {
      tile.element.remove();
    });
    this.tiles.clear();
    this.tileIdCounter = 0;
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
      const value = Math.random() < 0.9 ? 2 : 4;
      this.grid[i][j] = value;
      this.createTile(value, i, j, true);
    }
  }
  
  bindEvents() {
    // Use a hidden input to capture keyboard events properly
    const keyboardInput = document.getElementById('keyboardFocus');
    if (keyboardInput) {
      keyboardInput.focus();
    }
    
    // Global keyboard event listener
    document.addEventListener('keydown', (e) => {
      if (this.gameOver || this.animating) return;
      
      let moved = false;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          e.stopPropagation();
          moved = this.moveUp();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          e.stopPropagation();
          moved = this.moveDown();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          e.stopPropagation();
          moved = this.moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          e.stopPropagation();
          moved = this.moveRight();
          break;
      }
      
      if (moved) {
        setTimeout(() => {
          this.addRandomTile();
          this.updateDisplay();
          
          if (this.checkGameOver()) {
            this.endGame();
          }
        }, 100); // Faster new tile appearance
      }
    });
    
    // Ensure the hidden input stays focused for keyboard input
    document.addEventListener('click', () => {
      if (keyboardInput) {
        keyboardInput.focus();
      }
    });
    
    // Prevent focus loss and keep keyboard input focused
    document.addEventListener('blur', () => {
      setTimeout(() => {
        if (keyboardInput) {
          keyboardInput.focus();
        }
      }, 0);
    });
    
    // Also listen for focus events on the hidden input
    if (keyboardInput) {
      keyboardInput.addEventListener('focus', () => {
        // Keyboard input focused
      });
      
      keyboardInput.addEventListener('blur', () => {
        setTimeout(() => keyboardInput.focus(), 0);
      });
    }
  }
  
  moveLeft() {
    if (this.animating) return false;
    
    this.animating = true;
    let moved = false;
    const movements = [];
    const merges = [];
    
    for (let row = 0; row < 4; row++) {
      const originalRow = [...this.grid[row]];
      const tiles = [];
      
      // Get tiles in this row
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] !== 0) {
          const tileId = this.findTileAt(row, col);
          if (tileId !== null) {
            tiles.push({ id: tileId, value: this.grid[row][col], origCol: col });
          }
        }
      }
      
      // Clear the row in the grid
      this.grid[row] = [0, 0, 0, 0];
      
      // Process movement and merging
      let newCol = 0;
      let i = 0;
      
      while (i < tiles.length) {
        if (i < tiles.length - 1 && tiles[i].value === tiles[i + 1].value) {
          // Merge tiles
          const mergedValue = tiles[i].value * 2;
          this.grid[row][newCol] = mergedValue;
          
          merges.push({
            tile1: tiles[i].id,
            tile2: tiles[i + 1].id,
            newValue: mergedValue,
            newRow: row,
            newCol: newCol
          });
          
          this.score += mergedValue;
          i += 2; // Skip both merged tiles
        } else {
          // Move single tile
          this.grid[row][newCol] = tiles[i].value;
          
          if (tiles[i].origCol !== newCol) {
            movements.push({
              tileId: tiles[i].id,
              newRow: row,
              newCol: newCol
            });
          }
          
          i++;
        }
        newCol++;
      }
      
      if (JSON.stringify(originalRow) !== JSON.stringify(this.grid[row])) {
        moved = true;
      }
    }
    
    // Execute animations
    movements.forEach(move => {
      this.moveTile(move.tileId, move.newRow, move.newCol);
    });
    
    merges.forEach(merge => {
      this.mergeTiles(merge.tile1, merge.tile2, merge.newValue, merge.newRow, merge.newCol);
    });
    
    // End animation after delay
    setTimeout(() => {
      this.animating = false;
    }, 350);
    
    return moved;
  }
  
  findTileAt(row, col) {
    for (let [tileId, tile] of this.tiles) {
      if (tile.row === row && tile.col === col) {
        return tileId;
      }
    }
    return null;
  }
  
  moveRight() {
    if (this.animating) return false;
    this.animating = true;
    
    // For now, use the sync method and then sync tiles
    let moved = false;
    for (let i = 0; i < 4; i++) {
      const originalRow = [...this.grid[i]];
      const reversedRow = [...this.grid[i]].reverse();
      const mergedRow = this.mergeLine(reversedRow);
      
      while (mergedRow.length < 4) mergedRow.push(0);
      const newRow = mergedRow.reverse();
      
      this.grid[i] = newRow;
      if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
        moved = true;
      }
    }
    
    if (moved) {
      this.syncTilesWithGrid();
    }
    
    setTimeout(() => {
      this.animating = false;
    }, 350);
    
    return moved;
  }
  
  moveUp() {
    if (this.animating) return false;
    this.animating = true;
    
    let moved = false;
    for (let j = 0; j < 4; j++) {
      const originalCol = this.getColumn(j);
      const newCol = this.mergeLine([...originalCol]);
      
      while (newCol.length < 4) newCol.push(0);
      
      this.setColumn(j, newCol);
      if (JSON.stringify(originalCol) !== JSON.stringify(newCol)) {
        moved = true;
      }
    }
    
    if (moved) {
      this.syncTilesWithGrid();
    }
    
    setTimeout(() => {
      this.animating = false;
    }, 350);
    
    return moved;
  }
  
  moveDown() {
    if (this.animating) return false;
    this.animating = true;
    
    let moved = false;
    for (let j = 0; j < 4; j++) {
      const originalCol = this.getColumn(j);
      const reversedCol = [...originalCol].reverse();
      const mergedCol = this.mergeLine(reversedCol);
      
      while (mergedCol.length < 4) mergedCol.push(0);
      const newCol = mergedCol.reverse();
      
      this.setColumn(j, newCol);
      if (JSON.stringify(originalCol) !== JSON.stringify(newCol)) {
        moved = true;
      }
    }
    
    if (moved) {
      this.syncTilesWithGrid();
    }
    
    setTimeout(() => {
      this.animating = false;
    }, 350);
    
    return moved;
  }
  
  getColumn(colIndex) {
    return this.grid.map(row => row[colIndex]);
  }
  
  setColumn(colIndex, col) {
    for (let i = 0; i < 4; i++) {
      this.grid[i][colIndex] = col[i];
    }
  }
  
  mergeLine(line) {
    // Remove zeros first
    const filtered = line.filter(tile => tile !== 0);
    const merged = [];
    
    let i = 0;
    while (i < filtered.length) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        // Merge tiles
        const mergedValue = filtered[i] * 2;
        merged.push(mergedValue);
        this.score += mergedValue;
        i += 2; // Skip both merged tiles
      } else {
        // No merge, just add the tile
        merged.push(filtered[i]);
        i++;
      }
    }
    
    return merged;
  }
  
  updateDisplay() {
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
  
  syncTilesWithGrid() {
    // Clear all existing tiles
    this.clearAllTiles();
    
    // Create tiles based on current grid state
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] !== 0) {
          this.createTile(this.grid[i][j], i, j, false);
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
    overlay.innerHTML = '<h2>Game Over!</h2>' +
      '<p>Final Score: ' + this.score + '</p>' +
      '<button class="play-again-btn" id="playAgainBtn">Play Again</button>';
    document.getElementById('gameContainer').appendChild(overlay);
    
    // Add event listener to the play again button
    const playAgainBtn = overlay.querySelector('#playAgainBtn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => this.reset());
    }
  }

  win() {
    // Don't end the game, just show a win message
    this.best = Math.max(this.best, this.score);
    localStorage.setItem('2048-best', this.score.toString());
    saveScore(this.score);
    
    // Check if there's already a win overlay
    let overlay = document.querySelector('.game-over');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'game-over';
      overlay.innerHTML = '<h2>🎉 You Won! 🎉</h2>' +
        '<p>You reached 2048!</p>' +
        '<p>Keep playing to get a higher score!</p>' +
        '<button class="play-again-btn" id="continueBtn">Continue Playing</button>' +
        '<button class="play-again-btn" id="playAgainBtnWin">New Game</button>';
      document.getElementById('gameContainer').appendChild(overlay);
      
      // Add event listeners
      const continueBtn = overlay.querySelector('#continueBtn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          overlay.remove();
        });
      }
      
      const playAgainBtn = overlay.querySelector('#playAgainBtnWin');
      if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => this.reset());
      }
    }
  }

  reset() {
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.animating = false;
    
    const overlay = document.getElementById('gameContainer').querySelector('.game-over');
    if (overlay) overlay.remove();
    
    this.clearAllTiles();
    this.initGrid();
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
