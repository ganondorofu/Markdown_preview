# Popup Pro VSCode Extension

This is a Visual Studio Code extension called "Popup Pro".

## Features

- Adds a button to the VS Code activity bar.
- Clicking the button triggers a popup message in VSCode.

## How to Use

1.  Install the extension.
2.  Find the "Popup Pro" icon (a speech bubble) in the Activity Bar on the side of VS Code.
3.  Click the icon.
4.  A popup message will appear.

## Development

- Clone the repository.
- Run `npm install`.
- Open the project in VS Code.
- Press `F5` to open a new Extension Development Host window with the extension loaded.
- Make changes to the code in `src/extension.ts`.
- To see your changes, reload the Extension Development Host window (Developer: Reload Window).

## Building

```bash
npm run compile
```

This will compile the TypeScript files to the `out` directory.
```

## Packaging

To package the extension into a .vsix file:
```bash
npm install -g @vscode/vsce
vsce package
```
