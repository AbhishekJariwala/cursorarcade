import * as vscode from 'vscode';

/**
 * Interface that all games must implement
 */
export interface Game {
    /**
     * Gets the HTML content for the game
     * @param webview The webview instance
     * @param extensionUri The extension URI
     * @returns HTML string for the game
     */
    getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string;
    
    /**
     * Gets the display name of the game
     * @returns Game name
     */
    getName(): string;
    
    /**
     * Gets the emoji icon for the game
     * @returns Game icon emoji
     */
    getIcon(): string;
    
    /**
     * Gets the description of the game
     * @returns Game description
     */
    getDescription(): string;
    
    /**
     * Gets the unique identifier for the game
     * @returns Game identifier
     */
    getId(): string;
}

/**
 * Base game class with common functionality
 */
export abstract class BaseGame implements Game {
    abstract getName(): string;
    abstract getIcon(): string;
    abstract getDescription(): string;
    abstract getId(): string;
    abstract getHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string;
    
    /**
     * Gets the common game HTML template
     * @param webview The webview instance
     * @param extensionUri The extension URI
     * @param title The game title
     * @param styles The game-specific styles
     * @param bodyContent The game body content
     * @param scripts The game-specific scripts
     * @returns Complete HTML string
     */
    protected getGameHtmlTemplate(
        webview: vscode.Webview, 
        extensionUri: vscode.Uri, 
        title: string, 
        styles: string, 
        bodyContent: string, 
        scripts: string
    ): string {
        const { getNonce, getBasicHtmlTemplate } = require('../utils/WebviewUtils');
        const nonce = getNonce();
        
        return getBasicHtmlTemplate(webview, nonce, title) + `
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
     * Gets the back button HTML
     * @returns Back button HTML string
     */
    protected getBackButtonHtml(): string {
        return `<button class="back-btn" onclick="goBack()">← Back</button>`;
    }
    
    /**
     * Gets the common back button functionality script
     * @returns Back button script
     */
    protected getBackButtonScript(): string {
        return `
function goBack() {
    const vscode = acquireVsCodeApi();
    vscode.postMessage({
        command: 'goBack'
    });
}`;
    }
    
    /**
     * Gets the common score saving functionality
     * @returns Score saving script
     */
    protected getScoreSavingScript(): string {
        return `
function saveScore(score) {
    const totalGames = parseInt(localStorage.getItem('totalGames') || '0') + 1;
    const bestScore = Math.max(parseInt(localStorage.getItem('bestScore') || '0'), score);
    
    localStorage.setItem('totalGames', totalGames.toString());
    localStorage.setItem('bestScore', bestScore.toString());
}`;
    }
}
