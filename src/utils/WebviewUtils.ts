import * as vscode from 'vscode';

/**
 * Generates a random nonce for Content Security Policy
 * @returns A random 32-character string
 */
export function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * Creates a Content Security Policy string for webviews
 * @param webview The webview instance
 * @param nonce The nonce for script execution
 * @returns CSP string
 */
export function getCSP(webview: vscode.Webview, nonce: string): string {
    return `default-src 'none'; img-src ${webview.cspSource} https:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval';`;
}

/**
 * Gets the webview URI for a resource
 * @param webview The webview instance
 * @param extensionUri The extension URI
 * @param path The path to the resource
 * @returns The webview URI
 */
export function getWebviewUri(webview: vscode.Webview, extensionUri: vscode.Uri, path: string): vscode.Uri {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, path));
}

/**
 * Creates a basic HTML template with common meta tags and CSP
 * @param webview The webview instance
 * @param nonce The nonce for script execution
 * @param title The page title
 * @returns Basic HTML template
 */
export function getBasicHtmlTemplate(webview: vscode.Webview, nonce: string, title: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="${getCSP(webview, nonce)}" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>`;
}
