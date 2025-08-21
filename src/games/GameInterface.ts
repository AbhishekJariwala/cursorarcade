import * as vscode from 'vscode';

/**
 * Interface that all games must implement
 */
export interface Game {
    /**
     * Gets the HTML content for the game
     * @param webview The webview instance
     * @param extensionUri The extension URI
     * @param viewType Optional view type for responsive design
     * @returns HTML string for the game
     */
    getHtml(webview: vscode.Webview, extensionUri: vscode.Uri, viewType?: string): string;
    
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
    abstract getHtml(webview: vscode.Webview, extensionUri: vscode.Uri, viewType?: string): string;
    
    /**
     * Determines if the game is in sidebar mode (narrow layout)
     * @param viewType The view type identifier
     * @returns True if in sidebar mode, false for bottom panel or undefined
     */
    protected isSidebarMode(viewType?: string): boolean {
        return viewType === 'ideArcadeView';
    }
    
    /**
     * Determines if the game is in bottom panel mode (wide layout)
     * @param viewType The view type identifier
     * @returns True if in bottom panel mode, false for sidebar or undefined
     */
    protected isBottomPanelMode(viewType?: string): boolean {
        return viewType === 'ideArcadeBottomView';
    }
    
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
        return `<button class="back-btn" id="backButton" onclick="window.goBack && window.goBack()">← Back</button>`;
    }
    
    /**
     * Gets the common back button functionality script
     * @returns Back button script
     */
    protected getBackButtonScript(): string {
        return `
function goBack() {
    try {
        const vscode = acquireVsCodeApi();
        vscode.postMessage({
            command: 'goBack'
        });
    } catch (error) {
        // Error handling
    }
}

// Make goBack globally available as fallback
window.goBack = goBack;

// Try to set up back button immediately
(function() {
    const setupBackButton = function() {
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', function(event) {
                event.preventDefault();
                goBack();
            });
            return true;
        }
        return false;
    };

    // Try immediate setup
    if (!setupBackButton()) {
        // If immediate setup fails, wait for DOM
        document.addEventListener('DOMContentLoaded', function() {
            const backButton = document.getElementById('backButton');
            if (backButton) {
                backButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    goBack();
                });
            }
        });
    }
})();`;
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
