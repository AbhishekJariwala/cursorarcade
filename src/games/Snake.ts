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
    border: 3px solid #4A90E2;
    background: #000;
    position: relative;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }
  
  #score {
    color: #4A90E2;
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(20, 30, 16, 0.95);
    color: #FFFFFF;
    padding: 40px;
    border-radius: 12px;
    text-align: center;
    border: 3px solid #4A90E2;
    font-family: 'Fira Mono', monospace;
    box-shadow: 0 12px 32px rgba(0,0,0,0.5);
  }
  
  .game-over h2 {
    color: #FF6B6B;
    margin-bottom: 20px;
    font-size: 1.8em;
  }
  
  .game-over button {
    background: #4A90E2;
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
    background: #357ABD;
    transform: translateY(-2px);
  }
  
  .play-again-btn {
    background: #4A90E2;
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
    background: #357ABD;
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
    this.snake = [{x: 10, y: 10}];
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
        x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
        y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
      };
    } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
  }
  
  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (this.gameOver) return;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (this.direction !== 'down') this.direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (this.direction !== 'up') this.direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (this.direction !== 'right') this.direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (this.direction !== 'left') this.direction = 'right';
          break;
      }
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
    if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
        head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
      this.endGame();
      return;
    }
    
    // Check self collision
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.endGame();
      return;
    }
    
    this.snake.unshift(head);
    
    // Check food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.food = this.generateFood();
      this.speed = Math.max(50, this.speed - 2);
    } else {
      this.snake.pop();
    }
    
    document.getElementById('score').textContent = 'Score: ' + this.score;
  }
  
  draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw snake
    this.ctx.fillStyle = '#4CAF50';
    this.snake.forEach((segment, index) => {
      if (index === 0) {
        this.ctx.fillStyle = '#66BB6A';
      } else {
        this.ctx.fillStyle = '#4CAF50';
      }
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize - 1,
        this.gridSize - 1
      );
    });
    
    // Draw food
    this.ctx.fillStyle = '#FF5722';
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
    document.body.appendChild(overlay);
    
    // Add event listener to the play again button
    const playAgainBtn = overlay.querySelector('#playAgainBtn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => this.reset());
    }
  }
  
  reset() {
    this.snake = [{x: 10, y: 10}];
    this.food = this.generateFood();
    this.direction = 'right';
    this.score = 0;
    this.gameOver = false;
    this.speed = 150;
    
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
