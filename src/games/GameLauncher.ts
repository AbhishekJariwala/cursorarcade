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
     * @param viewType Optional view type for responsive design
     * @returns HTML string for the game launcher
     */
    getHtml(webview: vscode.Webview, extensionUri: vscode.Uri, viewType?: string): string {
        const nonce = getNonce();
        
        // Determine layout mode
        const isSidebar = viewType === 'subwaySurfersView';
        const isBottomPanel = viewType === 'subwaySurfersBottomView';
        
        const styles = getAllSharedStyles() + `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap');
  
  body {
    font-family: 'Fira Mono', monospace;
    background: #151110;
    color: #FFFFFF;
  }
  
  .container {
    max-width: ${isSidebar ? '280px' : isBottomPanel ? '800px' : '311px'};
    margin: 0 auto;
    padding: ${isSidebar ? '15px' : '20px'};
    text-align: center;
  }
  
  .logo-container {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .logo {
    width: ${isSidebar ? '200px' : isBottomPanel ? '350px' : '291px'};
    height: auto;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
    transition: all 0.3s ease;
  }
  
  .logo:hover {
    filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.7));
    transform: scale(1.02);
  }
  
  .subtitle {
    font-size: 1em;
    margin-bottom: 40px;
    opacity: 0.8;
    font-weight: 400;
  }
  
  .games-grid {
    display: ${isBottomPanel ? 'grid' : 'flex'};
    ${isBottomPanel ? 'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));' : 'flex-direction: column;'}
    gap: 15px;
    margin-top: 30px;
  }
  
  .game-card {
    background: #201E1C;
    border: none;
    border-radius: 8px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    position: relative;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  
  .game-card:hover {
    background: #2A2826;
    transform: translateY(-2px);
  }
  
  .game-title {
    font-size: 1.4em;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0;
    font-family: 'Fira Mono', monospace;
  }
  
  .game-description {
    font-size: 0.9em;
    opacity: 0.8;
    line-height: 1.3;
    color: #DBDFDF;
    margin-top: 5px;
    font-family: 'Fira Mono', monospace;
  }
  
  .stats {
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid #2A2826;
  }
  
  .stats h3 {
    font-size: 1.1em;
    margin-bottom: 20px;
    color: #DBDFDF;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: ${isSidebar ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)'};
    gap: 15px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    font-size: 1.5em;
    font-weight: 700;
    color: #FFFFFF;
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 0.8em;
    color: #DBDFDF;
    opacity: 0.8;
  }`;

        const bodyContent = `
  <div class="container">
    <div class="logo-container">
      <img src="${webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'IDEArcade.svg'))}" alt="IDE ARCADE" class="logo" />
    </div>
    <div class="subtitle">Take a break while your code compiles!</div>
    
    <div class="games-grid">
      ${this.games.map(game => `
        <div class="game-card" data-game-id="${game.getId()}">
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
    console.log('launchGame called with:', gameType);
    // Send message to VS Code extension to launch specific game
    const vscode = acquireVsCodeApi();
    console.log('vscode API acquired:', vscode);
    vscode.postMessage({
      command: 'launchGame',
      game: gameType
    });
    console.log('Message posted to VS Code');
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
  
  // Add click event listeners to game cards
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners');
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
      console.log('Setting up click listener for:', card);
      card.addEventListener('click', function() {
        const gameId = this.getAttribute('data-game-id');
        console.log('Card clicked, game ID:', gameId);
        launchGame(gameId);
      });
    });
  });
  
  // Initialize stats
  loadStats();
  console.log('Game launcher scripts loaded');`;

        return getBasicHtmlTemplate(webview, nonce, 'IDE Arcade') + `
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
