
import * as vscode from 'vscode';
import MarkdownIt from 'markdown-it';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mdContainer = require('markdown-it-container');

let docusaurusPreviewPanel: vscode.WebviewPanel | undefined = undefined;
let previewedDocumentUri: vscode.Uri | undefined = undefined;

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
    .use(mdContainer, 'note', createAdmonitionRenderer('note', 'Note'))
    .use(mdContainer, 'tip', createAdmonitionRenderer('tip', 'Tip'))
    .use(mdContainer, 'info', createAdmonitionRenderer('info', 'Info'))
    .use(mdContainer, 'warning', createAdmonitionRenderer('warning', 'Warning'))
    .use(mdContainer, 'danger', createAdmonitionRenderer('danger', 'Danger'))
    .use(mdContainer, 'caution', createAdmonitionRenderer('caution', 'Caution', 'warning')); // Caution uses warning styles

function createAdmonitionRenderer(type: string, defaultTitle: string, cssClassTypeOverride?: string) {
    return {
        validate: function(params: string) {
            return params.trim().match(new RegExp(`^${type}\\s*(.*)$`));
        },
        render: function (tokens: any[], idx: number) {
            const token = tokens[idx];
            const m = token.info.trim().match(new RegExp(`^${type}\\s*(.*)$`));
            const actualCssClassType = cssClassTypeOverride || type;

            if (token.nesting === 1) {
                // opening tag
                const title = m && m[1] ? md.renderInline(m[1]) : defaultTitle;
                return `<div class="admonition admonition-${actualCssClassType}"><div class="admonition-heading"><h5>${title}</h5></div><div class="admonition-content">\n`;
            } else {
                // closing tag
                return '</div></div>\n';
            }
        }
    };
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "popup-pro" is now active!');

    let showPopupDisposable = vscode.commands.registerCommand('popup-pro.showPopup', () => {
        vscode.window.showInformationMessage('Hello from Popup Pro! You triggered the popup.');
    });
    context.subscriptions.push(showPopupDisposable);

    let showDocusaurusPreviewDisposable = vscode.commands.registerCommand('docusaurus-preview.show', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || activeEditor.document.languageId !== 'markdown') {
            vscode.window.showErrorMessage('No active Markdown editor found or current file is not Markdown.');
            return;
        }

        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.ViewColumn.Beside
            : vscode.ViewColumn.One;

        if (docusaurusPreviewPanel) {
            docusaurusPreviewPanel.reveal(columnToShowIn);
            // If revealing an existing panel for a new document, update its content and tracked URI
            if (previewedDocumentUri?.toString() !== activeEditor.document.uri.toString()) {
                 updateWebviewContent(activeEditor.document);
                 previewedDocumentUri = activeEditor.document.uri;
            }
        } else {
            docusaurusPreviewPanel = vscode.window.createWebviewPanel(
                'docusaurusPreview',
                'Docusaurus Preview',
                columnToShowIn,
                {
                    enableScripts: true, // Keep false if no scripts are needed, true for future flexibility
                    localResourceRoots: [context.extensionUri] // For loading resources from extension
                }
            );
            previewedDocumentUri = activeEditor.document.uri;
            updateWebviewContent(activeEditor.document);

            docusaurusPreviewPanel.onDidDispose(
                () => {
                    docusaurusPreviewPanel = undefined;
                    previewedDocumentUri = undefined;
                },
                null,
                context.subscriptions
            );
        }
    });
    context.subscriptions.push(showDocusaurusPreviewDisposable);

    // Listener for text document changes to update the preview live
    const onDidChangeTextDocumentDisposable = vscode.workspace.onDidChangeTextDocument(event => {
        if (docusaurusPreviewPanel && previewedDocumentUri && event.document.uri.toString() === previewedDocumentUri.toString()) {
            updateWebviewContent(event.document);
        }
    });
    context.subscriptions.push(onDidChangeTextDocumentDisposable);

    // Optional: If the active editor changes, and it's the one being previewed, ensure panel is up-to-date
    // This is mostly handled by the button click logic for simplicity.
    // vscode.window.onDidChangeActiveTextEditor(editor => {
    // if (editor && docusaurusPreviewPanel && previewedDocumentUri && editor.document.uri.toString() === previewedDocumentUri.toString()) {
    // updateWebviewContent(editor.document);
    // }
    // });
}

function updateWebviewContent(document: vscode.TextDocument) {
    if (!docusaurusPreviewPanel) {
        return;
    }
    const markdownText = document.getText();
    const htmlContent = md.render(markdownText);
    docusaurusPreviewPanel.webview.html = getWebviewHtml(htmlContent, docusaurusPreviewPanel.webview);
}

function getWebviewHtml(content: string, webview: vscode.Webview): string {
    const nonce = getNonce(); // For Content Security Policy

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Docusaurus Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            padding: 20px;
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-editor-background);
            line-height: 1.6;
        }
        h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            line-height: 1.25;
        }
        h1 { font-size: 2em; border-bottom: 1px solid var(--vscode-editorWidget-border, #454545); padding-bottom: .3em;}
        h2 { font-size: 1.75em; border-bottom: 1px solid var(--vscode-editorWidget-border, #454545); padding-bottom: .3em;}
        h3 { font-size: 1.5em; }
        h4 { font-size: 1.25em; }
        h5 { font-size: 1em; }
        h6 { font-size: 0.85em; }
        
        p { margin-bottom: 1em; }
        a { color: var(--vscode-textLink-foreground); text-decoration: none; }
        a:hover { text-decoration: underline; }
        
        code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            padding: .2em .4em;
            margin: 0;
            font-size: 85%;
            background-color: var(--vscode-textBlockQuote-background, rgba(127, 127, 127, 0.1));
            border-radius: 3px;
        }
        pre {
            background-color: var(--vscode-textBlockQuote-background, rgba(127, 127, 127, 0.1));
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            border-radius: 3px;
            border: 1px solid var(--vscode-editorWidget-border, #454545);
        }
        pre code {
            padding: 0;
            margin: 0;
            font-size: 100%;
            background-color: transparent;
            border-radius: 0;
            border: none;
        }
        
        blockquote {
            padding: 0 1em;
            color: var(--vscode-textSeparator-foreground, #777);
            border-left: .25em solid var(--vscode-textBlockQuote-border, #ccc);
            margin-left: 0;
            margin-right: 0;
            margin-bottom: 1em;
        }
        
        table {
            border-collapse: collapse;
            width: auto;
            margin-bottom: 16px;
            display: block;
            overflow-x: auto; /* For wide tables */
        }
        th, td {
            border: 1px solid var(--vscode-editorWidget-border, #454545);
            padding: 8px 13px;
        }
        th {
            font-weight: 600;
            background-color: var(--vscode-toolbar-hoverBackground, rgba(90, 93, 94, 0.31));
        }
        
        img {
            max-width: 100%;
            height: auto;
            border-radius: 3px;
        }
        
        hr {
            border: 0;
            height: .25em;
            background: var(--vscode-editorWidget-border, #454545);
            margin: 24px 0;
        }

        /* Docusaurus admonition styling */
        .admonition {
            padding: 1rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            border: 1px solid transparent;
            border-radius: 0.25rem; 
            border-left-width: .3rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
        }
        .admonition-heading h5 {
            font-weight: bold;
            margin-top: 0;
            margin-bottom: 0.5rem;
            font-size: 1em;
            color: inherit;
        }
        .admonition-content > p:last-child {
            margin-bottom: 0;
        }

        .admonition-note {
            border-left-color: #54c7ec; /* Docusaurus --ifm-color-info */
            background-color: rgba(84, 199, 236, 0.1);
        }
        .admonition-tip {
            border-left-color: #5cb85c; /* Docusaurus --ifm-color-success */
            background-color: rgba(92, 184, 92, 0.1);
        }
        .admonition-info {
            border-left-color: #54c7ec; /* Docusaurus --ifm-color-info */
            background-color: rgba(84, 199, 236, 0.1);
        }
        .admonition-warning, .admonition-caution {
            border-left-color: #f0ad4e; /* Docusaurus --ifm-color-warning */
            background-color: rgba(240, 173, 78, 0.1);
        }
        .admonition-danger {
            border-left-color: #d9534f; /* Docusaurus --ifm-color-danger */
            background-color: rgba(217, 83, 79, 0.1);
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function deactivate() {
    if (docusaurusPreviewPanel) {
        docusaurusPreviewPanel.dispose();
    }
}
