import * as vscode from 'vscode';
import { Game } from './GameInterface';
import { getNonce, getBasicHtmlTemplate } from '../utils/WebviewUtils';
import { getAllSharedStyles } from '../utils/StyleUtils';

export class GameLauncher {
    private games: Game[] = [];

    constructor(games: Game[]) {
        this.games = games;
    }

    /**
     * Gets the HTML content for the game launcher hub
     * @param webview The webview instance
     * @param extensionUri The extension URI
     * @returns HTML string for the game launcher
     */
    getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const nonce = getNonce();
        
        const styles = getAllSharedStyles() + `
  h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  .subtitle {
    font-size: 1.2em;
    margin-bottom: 40px;
    opacity: 0.9;
  }
  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-top: 30px;
  }
  .game-icon {
    font-size: 3em;
    margin-bottom: 15px;
    display: block;
  }
  .game-title {
    font-size: 1.3em;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .game-description {
    font-size: 0.9em;
    opacity: 0.8;
    line-height: 1.4;
  }`;

        const bodyContent = `
  <div class="container">
    <h1>🎮 Game Hub</h1>
    <div class="subtitle">Take a break while your code compiles!</div>
    
    <div class="games-grid">
      ${this.games.map(game => `
        <div class="game-card" onclick="launchGame('${game.getId()}')">
          <span class="game-icon">${game.getIcon()}</span>
          <div class="game-title">${game.getName()}</div>
          <div class="game-description">${game.getDescription()}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="stats">
      <h3>📊 Your Stats</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value" id="totalGames">0</div>
          <div class="stat-label">Games Played</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" id="bestScore">0</div>
          <div class="stat-label">Best Score</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" id="totalTime">0m</div>
          <div class="stat-label">Total Time</div>
        </div>
      </div>
    </div>
  </div>`;

        const scripts = `
  // Game launcher functionality
  function launchGame(gameType) {
    // Send message to VS Code extension to launch specific game
    const vscode = acquireVsCodeApi();
    vscode.postMessage({
      command: 'launchGame',
      game: gameType
    });
  }
  
  // Load stats from localStorage
  function loadStats() {
    const totalGames = localStorage.getItem('totalGames') || 0;
    const bestScore = localStorage.getItem('bestScore') || 0;
    const totalTime = localStorage.getItem('totalTime') || 0;
    
    document.getElementById('totalGames').textContent = totalGames;
    document.getElementById('bestScore').textContent = bestScore;
    document.getElementById('totalTime').textContent = totalTime + 'm';
  }
  
  // Initialize stats
  loadStats();`;

        return getBasicHtmlTemplate(webview, nonce, 'VS Code Game Hub') + `
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

    /**
     * Gets the list of available games
     * @returns Array of game instances
     */
    getGames(): Game[] {
        return this.games;
    }

    /**
     * Gets a game by its ID
     * @param gameId The game identifier
     * @returns Game instance or undefined if not found
     */
    getGameById(gameId: string): Game | undefined {
        return this.games.find(game => game.getId() === gameId);
    }
}
