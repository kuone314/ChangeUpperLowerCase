import * as vscode from 'vscode';

///////////////////////////////////////////////////////////////////////////////////////////////////
function offset(document: vscode.TextDocument, range: vscode.Position, val: number): vscode.Position {
	const offset = document.offsetAt(range);
	const nextOffset = offset + 1;
	return document.positionAt(nextOffset);
}

// Rnageが空なら、1文字の選択にする。
// ただし、行末なら空のまま。
function normalize(document: vscode.TextDocument, range: vscode.Range): vscode.Range {
	return !range.isEmpty
		? range
		: new vscode.Range(range.start, offset(document, range.start, 1));
}

///////////////////////////////////////////////////////////////////////////////////////////////////
const EXEC_TYPE = {
	toUpper: "toUpper",
	toLower: "toLower",
};
type ExecType = typeof EXEC_TYPE[keyof typeof EXEC_TYPE];

function detectExecType(editor: vscode.TextEditor): ExecType | null {
	const document = editor.document;

	for (const selection of editor.selections) {
		for (const character of document.getText(normalize(document, selection))) {
			if (character !== character.toUpperCase()) { return EXEC_TYPE.toUpper; }
			if (character !== character.toLowerCase()) { return EXEC_TYPE.toLower; }
		}
	}

	return null;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
function transformSetections(editor: vscode.TextEditor, func: (a: string) => string) {
	editor.edit(editBuilder => {
		for (const orgSelection of editor.selections) {
			const selectionEx = normalize(editor.document, orgSelection);
			const newStr = func(editor.document.getText(selectionEx));
			editBuilder.replace(selectionEx, newStr);
		}
	});
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('Change Upper Lower Case at Caret', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		const execType = detectExecType(editor);
		if (!execType) { return; }

		const func = (execType === EXEC_TYPE.toUpper)
			? (c: string) => c.toUpperCase()
			: (c: string) => c.toLowerCase();

		transformSetections(editor, func);
	});

	context.subscriptions.push(disposable);
}
