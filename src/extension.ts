import * as vscode from 'vscode';

interface EditorState {
	uri: string;
	selections: { start: vscode.Position; end: vscode.Position }[]
}

let savedState: EditorState[] | null = null;

export function activate(context: vscode.ExtensionContext) {
	const disposableSet = vscode.commands.registerCommand('kunkka.setCross', () => {
		const editors = vscode.window.visibleTextEditors;

		savedState = editors.map(editor => ({
			uri: editor.document.uri.toString(),
			selections: editor.selections.map(sel => ({
				start: sel.start,
				end: sel.end
			}))
		}));

		vscode.window.showInformationMessage('✅ Cross set! Workspace state saved.');
	});

	const disposableGo = vscode.commands.registerCommand('kunkka.goToCross', async () => {
		if (!savedState || savedState.length === 0) {
			vscode.window.showWarningMessage('⚠ No Cross set yet.');
			return;
		}

		for (const state of savedState) {
			const doc = await vscode.workspace.openTextDocument(vscode.Uri.parse(state.uri));
			const editor = await vscode.window.showTextDocument(doc, { preview: false});

			editor.selections = state.selections.map(sel => new vscode.Selection(sel.start, sel.end));
		}

		vscode.window.showInformationMessage('↩ Returned to Cross state.');
	});

	context.subscriptions.push(disposableSet, disposableGo);
}

export function deactivate() {}
