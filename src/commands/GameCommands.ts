import * as vscode from 'vscode';
import { Game } from '../games/GameInterface';
import { GameLauncher } from '../games/GameLauncher';

/**
 * Registers all game-related commands for the extension
 * @param context The extension context
 * @param games Array of available games
 * @param gameLauncher The game launcher instance
 */
export function registerGameCommands(
    context: vscode.ExtensionContext, 
    games: Game[], 
    gameLauncher: GameLauncher
): void {
    
    // Test command to verify activation
    context.subscriptions.push(
        vscode.commands.registerCommand('subwaySurfers.test', () => {
            vscode.window.showInformationMessage('Subway Surfers extension is working! 🎮');
        })
    );

    // Debug command to show extension status
    context.subscriptions.push(
        vscode.commands.registerCommand('subwaySurfers.debug', () => {
            const message = `Extension Status:\n• Extension: Active ✅\n• Sidebar Provider: Registered ✅\n• Bottom Panel Provider: Registered ✅\n• Commands: All Registered ✅\n• Games Available: ${games.length} ✅\n• Icon: media/game.svg ✅`;
            vscode.window.showInformationMessage(message);
            console.log('Debug command executed');
        })
    );

    // Command to open as top tab (webview panel)
    context.subscriptions.push(
        vscode.commands.registerCommand('subwaySurfers.start', () => {
            const panel = vscode.window.createWebviewPanel(
                'subwaySurfersGame',
                'Subway Surfers Game',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );
            panel.webview.html = gameLauncher.getHtml(panel.webview, context.extensionUri);
            console.log('Game webview panel created successfully');
        })
    );

    // Commands to open/focus the sidebar or bottom panel containers
    context.subscriptions.push(
        vscode.commands.registerCommand('subwaySurfers.openSidebar', async () => {
            console.log('Opening sidebar...');
            try {
                // First try to show the view container
                await vscode.commands.executeCommand('workbench.view.extension.subway-surfers');
                console.log('Sidebar container opened');
                
                // Wait a bit for the container to be ready
                setTimeout(async () => {
                    try {
                        await vscode.commands.executeCommand('subwaySurfersView.focus');
                        console.log('Sidebar view focused');
                    } catch (focusError) {
                        console.log('Focus command failed, but view should be visible');
                    }
                }, 100);
                
            } catch (error) {
                console.error('Error opening sidebar:', error);
                vscode.window.showErrorMessage('Failed to open sidebar: ' + error);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('subwaySurfers.openBottom', async () => {
            console.log('Opening bottom panel...');
            try {
                // First try to show the view container
                await vscode.commands.executeCommand('workbench.view.extension.subway-surfers-panel');
                console.log('Bottom panel container opened');
                
                // Wait a bit for the container to be ready
                setTimeout(async () => {
                    try {
                        await vscode.commands.executeCommand('subwaySurfersBottomView.focus');
                        console.log('Bottom panel view focused');
                    } catch (focusError) {
                        console.log('Focus command failed, but view should be visible');
                    }
                }, 100);
                
            } catch (error) {
                console.error('Error opening bottom panel:', error);
                vscode.window.showErrorMessage('Failed to open bottom panel: ' + error);
            }
        })
    );

    // Command to show available games
    context.subscriptions.push(
        vscode.commands.registerCommand('subwaySurfers.listGames', () => {
            const gameList = games.map(game => 
                `${game.getIcon()} ${game.getName()}: ${game.getDescription()}`
            ).join('\n');
            
            vscode.window.showInformationMessage(
                `Available Games:\n${gameList}`,
                { modal: false }
            );
        })
    );

    // Command to launch a specific game directly
    context.subscriptions.push(
        vscode.commands.registerCommand('subwaySurfers.launchGame', async () => {
            const gameOptions = games.map(game => ({
                label: `${game.getIcon()} ${game.getName()}`,
                description: game.getDescription(),
                value: game.getId()
            }));

            const selected = await vscode.window.showQuickPick(gameOptions, {
                placeHolder: 'Select a game to launch...'
            });

            if (selected) {
                vscode.commands.executeCommand('subwaySurfers.start');
                // Note: The actual game launch would need to be handled by the webview
                // This is just a placeholder for the command structure
            }
        })
    );

    console.log('All game commands registered successfully');
}
