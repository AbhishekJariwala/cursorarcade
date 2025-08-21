import * as vscode from 'vscode';
import { BaseGame } from './GameInterface';
import { getNonce, getBasicHtmlTemplate } from '../utils/WebviewUtils';

export class SnakeGame extends BaseGame {
    getName(): string { return "Snake"; }
    getIcon(): string { return "🐍"; }
    getDescription(): string { return "Classic snake game with growing mechanics"; }
    getId(): string { return "snake"; }

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
  
  #gameContainer {
    border: 3px solid #DBDFDF;
    background: #151110;
    position: relative;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }
  
  #score {
    color: #DBDFDF;
    font-size: 1.8em;
    font-weight: 700;
    margin-bottom: 20px;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    letter-spacing: 1px;
  }
  
  #controls {
    color: #DBDFDF;
    font-size: 0.9em;
    margin-top: 20px;
    text-align: center;
    background: #201E1C;
    padding: 15px 25px;
    border-radius: 8px;
    border: 2px solid #DBDFDF;
  }
  
  .game-over {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(21, 17, 16, 0.95);
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
    background: #201E1C;
    border-color: #FFFFFF;
    transform: translateY(-2px);
  }`;

        const bodyContent = `
  ${this.getBackButtonHtml()}
  <div id="score">Score: 0</div>
  <canvas id="gameContainer" width="${isSidebar ? '280' : '400'}" height="${isSidebar ? '280' : '400'}"></canvas>
  <div id="controls">Use arrow keys or WASD to move</div>`;

        const scripts = `
${this.getBackButtonScript()}
${this.getScoreSavingScript()}

class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('gameContainer');
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = 20;
    
    // Calculate grid dimensions based on actual canvas size
    this.gridWidth = Math.floor(this.canvas.width / this.gridSize);
    this.gridHeight = Math.floor(this.canvas.height / this.gridSize);
    
    // Start snake in the center of the grid
    const centerX = Math.floor(this.gridWidth / 2);
    const centerY = Math.floor(this.gridHeight / 2);
    this.snake = [{x: centerX, y: centerY}];
    
    this.food = this.generateFood();
    this.direction = 'right';
    this.score = 0;
    this.gameOver = false;
    this.speed = 150;
    
    this.bindEvents();
    this.gameLoop();
  }
  
  generateFood() {
    let food;
    do {
      food = {
        x: Math.floor(Math.random() * this.gridWidth),
        y: Math.floor(Math.random() * this.gridHeight)
      };
    } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
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
    
    // Global keyboard event listener
    document.addEventListener('keydown', (e) => {
      if (this.gameOver) return;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          e.stopPropagation();
          if (this.direction !== 'down') this.direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          e.stopPropagation();
          if (this.direction !== 'up') this.direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          e.stopPropagation();
          if (this.direction !== 'right') this.direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          e.stopPropagation();
          if (this.direction !== 'left') this.direction = 'right';
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
  
  update() {
    if (this.gameOver) return;
    
    const head = {...this.snake[0]};
    
    switch(this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }
    
    // Check wall collision
    if (head.x < 0 || head.x >= this.gridWidth || head.y < 0 || head.y >= this.gridHeight) {
      this.endGame();
      return;
    }
    
    // Check self collision BEFORE adding the new head
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.endGame();
      return;
    }
    
    // Add new head
    this.snake.unshift(head);
    
    // Check food collision and handle growth
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.food = this.generateFood();
      this.speed = Math.max(50, this.speed - 2);
      // Don't remove tail (snake grows)
    } else {
      // Remove tail (snake moves without growing)
      this.snake.pop();
    }
    
    document.getElementById('score').textContent = 'Score: ' + this.score;
  }
  
  draw() {
    this.ctx.fillStyle = '#151110';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw snake
    this.ctx.fillStyle = '#DBDFDF';
    this.snake.forEach((segment, index) => {
      if (index === 0) {
        this.ctx.fillStyle = '#FFFFFF';
      } else {
        this.ctx.fillStyle = '#DBDFDF';
      }
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize - 1,
        this.gridSize - 1
      );
    });
    
    // Draw food
    this.ctx.fillStyle = '#201E1C';
    this.ctx.fillRect(
      this.food.x * this.gridSize,
      this.food.y * this.gridSize,
      this.gridSize - 1,
      this.gridSize - 1
    );
  }
  
  gameLoop() {
    this.update();
    this.draw();
    
    if (!this.gameOver) {
      setTimeout(() => this.gameLoop(), this.speed);
    }
  }
  
  endGame() {
    this.gameOver = true;
    saveScore(this.score);
    
    const overlay = document.createElement('div');
    overlay.className = 'game-over';
    overlay.innerHTML = \`
      <h2>Game Over!</h2>
      <p>Final Score: \${this.score}</p>
      <button class="play-again-btn" id="playAgainBtn">Play Again</button>
    \`;
    
    // Append overlay to body since we're using position: fixed
    document.body.appendChild(overlay);
    
    // Add event listener to the play again button
    const playAgainBtn = overlay.querySelector('#playAgainBtn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => this.reset());
    }
  }
  
  reset() {
    // Reset snake to center of grid
    const centerX = Math.floor(this.gridWidth / 2);
    const centerY = Math.floor(this.gridHeight / 2);
    this.snake = [{x: centerX, y: centerY}];
    
    this.food = this.generateFood();
    this.direction = 'right';
    this.score = 0;
    this.gameOver = false;
    this.speed = 150;
    
    // Remove overlay from body since that's where we place it
    const overlay = document.body.querySelector('.game-over');
    if (overlay) overlay.remove();
    
    this.gameLoop();
  }
}

const game = new SnakeGame();`;

        return getBasicHtmlTemplate(webview, nonce, 'Snake Game') + `
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
