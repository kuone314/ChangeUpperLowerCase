import * as vscode from 'vscode';

///////////////////////////////////////////////////////////////////////////////////////////////////

export function activate(context: vscode.ExtensionContext) {	
	let disposable = vscode.commands.registerCommand('change-upper-lower-case-for-single-character.helloWorld', () => {

	});

	context.subscriptions.push(disposable);
}
