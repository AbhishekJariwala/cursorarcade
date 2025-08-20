import * as vscode from 'vscode';
import { Game } from '../games/GameInterface';
import { GameLauncher } from '../games/GameLauncher';

/**
 * Webview provider for game views in VS Code
 */
export class GameViewProvider implements vscode.WebviewViewProvider {
    private gameLauncher: GameLauncher;
    private currentGame: Game | null = null;

    constructor(private readonly extensionUri: vscode.Uri, games: Game[]) {
        this.gameLauncher = new GameLauncher(games);
    }

    /**
     * Resolves the webview view when it's created
     * @param webviewView The webview view to resolve
     */
    resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
        console.log('Resolving webview view:', webviewView.viewType);
        
        // Configure webview options
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri]
        };
        
        // Set up message handling for game selection and navigation
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'launchGame':
                        this.launchGame(message.game, webviewView.webview);
                        break;
                    case 'goBack':
                        this.showLauncher(webviewView.webview);
                        break;
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
            webview.html = game.getHtml(webview, this.extensionUri);
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
        this.currentGame = null;
        webview.html = this.gameLauncher.getHtml(webview, this.extensionUri);
        console.log('Showing game launcher');
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
}
