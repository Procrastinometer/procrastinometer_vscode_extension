import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "procrastinometer" is now active!'
  );

  const disposable = vscode.commands.registerCommand(
    'procrastinometer.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello there!');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
