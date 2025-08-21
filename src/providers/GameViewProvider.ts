import * as vscode from 'vscode';
import { Game } from '../games/GameInterface';
import { GameLauncher } from '../games/GameLauncher';

/**
 * Webview provider for game views in VS Code
 */
export class GameViewProvider implements vscode.WebviewViewProvider {
    private gameLauncher: GameLauncher;
    private currentGame: Game | null = null;
    private viewType: string = '';

    constructor(private readonly extensionUri: vscode.Uri, games: Game[]) {
        this.gameLauncher = new GameLauncher(games);
    }

    /**
     * Resolves the webview view when it's created
     * @param webviewView The webview view to resolve
     */
    resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
        console.log('Resolving webview view:', webviewView.viewType);
        
        // Store the view type for responsive design
        this.viewType = webviewView.viewType;
        const isBottomPanel = webviewView.viewType === 'subwaySurfersBottomView';
        const isSidebar = webviewView.viewType === 'subwaySurfersView';
        
        console.log('View context:', { viewType: this.viewType, isBottomPanel, isSidebar });
        
        // Configure webview options with proper security settings
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri],
            portMapping: []
        };
        
        // Set up message handling for game selection and navigation
        webviewView.webview.onDidReceiveMessage(
            message => {
                console.log('GameViewProvider received message:', message);
                switch (message.command) {
                    case 'launchGame':
                        console.log('Launching game:', message.game);
                        this.launchGame(message.game, webviewView.webview);
                        break;
                    case 'goBack':
                        console.log('Going back to launcher');
                        this.showLauncher(webviewView.webview);
                        break;
                    default:
                        console.warn('Unknown command received:', message.command);
                }
            }
        );
        
        // Show the game launcher by default
        this.showLauncher(webviewView.webview);
        console.log('Webview HTML set successfully');
    }

    /**
     * Launches a specific game
     * @param gameType The type/ID of the game to launch
     * @param webview The webview instance
     */
    private launchGame(gameType: string, webview: vscode.Webview): void {
        const game = this.gameLauncher.getGameById(gameType);
        if (game) {
            this.currentGame = game;
            webview.html = game.getHtml(webview, this.extensionUri, this.viewType);
            console.log(`Launched game: ${game.getName()}`);
        } else {
            console.error(`Game not found: ${gameType}`);
            this.showLauncher(webview);
        }
    }

    /**
     * Shows the game launcher hub
     * @param webview The webview instance
     */
    private showLauncher(webview: vscode.Webview): void {
        console.log('showLauncher called - returning to game hub');
        this.currentGame = null;
        webview.html = this.gameLauncher.getHtml(webview, this.extensionUri, this.viewType);
        console.log('Game launcher HTML set successfully');
    }

    /**
     * Gets the current active game
     * @returns Current game or null if in launcher
     */
    getCurrentGame(): Game | null {
        return this.currentGame;
    }

    /**
     * Gets the game launcher instance
     * @returns Game launcher instance
     */
    getGameLauncher(): GameLauncher {
        return this.gameLauncher;
    }

    /**
     * Gets the webview content with proper HTML structure
     * @param webview The webview instance
     * @returns HTML string for the webview
     */
    private getWebviewContent(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${this.getNonce()}' 'unsafe-eval';">
    <title>IDE Arcade</title>
</head>
<body>
    <div id="app"></div>
    <script nonce="${this.getNonce()}">
        const vscode = acquireVsCodeApi();
        // This will be replaced by the actual content
    </script>
</body>
</html>`;
    }

    /**
     * Generates a nonce for security
     * @returns A random nonce string
     */
    private getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
