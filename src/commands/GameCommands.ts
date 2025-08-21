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
    
    // Command to open as top tab (webview panel)
    context.subscriptions.push(
        vscode.commands.registerCommand('ideArcade.start', () => {
            const panel = vscode.window.createWebviewPanel(
                'ideArcadeGame',
                'IDE Arcade',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );
            panel.webview.html = gameLauncher.getHtml(panel.webview, context.extensionUri);
        })
    );

    // Commands to open/focus the sidebar or bottom panel containers
    context.subscriptions.push(
        vscode.commands.registerCommand('ideArcade.openSidebar', async () => {
            try {
                // First try to show the view container
                await vscode.commands.executeCommand('workbench.view.extension.ide-arcade');
                
                // Wait a bit for the container to be ready
                setTimeout(async () => {
                    try {
                        await vscode.commands.executeCommand('ideArcadeView.focus');
                    } catch (focusError) {
                        // Focus command failed, but view should be visible
                    }
                }, 100);
                
            } catch (error) {
                vscode.window.showErrorMessage('Failed to open sidebar: ' + error);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('ideArcade.openBottom', async () => {
            try {
                // First try to show the view container
                await vscode.commands.executeCommand('workbench.view.extension.ide-arcade-panel');
                
                // Wait a bit for the container to be ready
                setTimeout(async () => {
                    try {
                        await vscode.commands.executeCommand('ideArcadeBottomView.focus');
                    } catch (focusError) {
                        // Focus command failed, but view should be visible
                    }
                }, 100);
                
            } catch (error) {
                vscode.window.showErrorMessage('Failed to open bottom panel: ' + error);
            }
        })
    );
}
