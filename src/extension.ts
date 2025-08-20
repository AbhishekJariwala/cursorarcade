import * as vscode from 'vscode';

// Import the new modular components
import { GameViewProvider } from './providers/GameViewProvider';
import { registerGameCommands } from './commands/GameCommands';
import { SubwaySurfersGame } from './games/SubwaySurfers';
import { SnakeGame } from './games/Snake';
import { Game2048 } from './games/Game2048';

export function activate(context: vscode.ExtensionContext) {
    console.log('Subway Surfers extension is now active!');

    // Initialize all available games
    const games = [
        new SubwaySurfersGame(),
        new SnakeGame(),
        new Game2048()
    ];

    // Create game launcher and view provider
    const gameProvider = new GameViewProvider(context.extensionUri, games);

    // Register game webview view providers for sidebar and bottom panel
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('subwaySurfersView', gameProvider)
    );
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('subwaySurfersBottomView', gameProvider)
    );
    console.log('Game webview view providers registered for sidebar and bottom');

    // Register all game commands
    registerGameCommands(context, games, gameProvider.getGameLauncher());

    console.log('All commands registered successfully');
}

export function deactivate() {}
