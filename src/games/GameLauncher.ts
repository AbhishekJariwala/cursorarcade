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
        const isSidebar = viewType === 'ideArcadeView';
        const isBottomPanel = viewType === 'ideArcadeBottomView';
        
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
    color: #DBDFDF;
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
    background: #DBDFDF;
    transform: translateY(-2px);
  }
  
  .game-card:hover .game-title,
  .game-card:hover .game-description {
    color: #151110;
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
    line-height: 1.3;
    color: #DBDFDF;
    margin-top: 5px;
    font-family: 'Fira Mono', monospace;
  }
  
  .footer-links {
    margin-top: 40px;
    display: flex;
    flex-direction: ${isSidebar ? 'column' : 'row'};
    gap: ${isSidebar ? '15px' : '20px'};
    justify-content: center;
    align-items: center;
  }
  
  .footer-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: #201E1C;
    border: 2px solid #DBDFDF;
    border-radius: 8px;
    color: #DBDFDF;
    text-decoration: none;
    font-family: 'Fira Mono', monospace;
    font-size: 0.9em;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .footer-link:hover {
    background: #DBDFDF;
    color: #151110;
    transform: translateY(-2px);
    border-color: #FFFFFF;
  }
  
  .link-icon {
    font-size: 1.1em;
  }
  
  .link-text {
    font-weight: 500;
  }
  
`;

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
    
    <div class="footer-links">
      <a href="https://github.com/AbhishekJariwala/cursorarcade" target="_blank" class="footer-link">
        <span class="link-icon">📚</span>
        <span class="link-text">View on GitHub</span>
      </a>
      <a href="https://buymeacoffee.com/abhijariwala" target="_blank" class="footer-link">
        <span class="link-icon">☕</span>
        <span class="link-text">Buy me a coffee</span>
      </a>
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
  
  // Add click event listeners to game cards
  document.addEventListener('DOMContentLoaded', function() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
      card.addEventListener('click', function() {
        const gameId = this.getAttribute('data-game-id');
        launchGame(gameId);
      });
    });
    
    // Add click event listeners to footer links
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          // Send message to VS Code to open external link
          const vscode = acquireVsCodeApi();
          vscode.postMessage({
            command: 'openExternalLink',
            url: href
          });
        }
      });
    });
  });`;

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
