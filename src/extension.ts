import * as vscode from 'vscode';

interface EditorState {
	uri: string;
	selections: { start: vscode.Position; end: vscode.Position }[];
	content: string;
}
interface CrossState {
	tabs: EditorState[];
	activeIndex: number;
}

let savedState: CrossState | null = null;

export function activate(context: vscode.ExtensionContext) {
	const disposableSet = vscode.commands.registerCommand('kunkka.setCross', async () => {
		const tabs = vscode.window.tabGroups.all.flatMap(group => group.tabs);
		const order: EditorState[] = [];

		for (const tab of tabs) {
			const uri = (tab.input as any)?.uri as vscode.Uri;
			if (!uri) continue;

			let content = '';
			let selections: { start: vscode.Position; end: vscode.Position }[] = [];

			const openEditor = vscode.window.visibleTextEditors.find(
				ed => ed.document.uri.toString() === uri.toString()
			);
			if (openEditor) {
				content = openEditor.document.getText();
				selections = openEditor.selections.map(sel => ({
					start: sel.start,
					end: sel.end
				}));
			} else {
				const doc = await vscode.workspace.openTextDocument(uri);
				content = doc.getText();
			}

			order.push({ uri: uri.toString(), selections, content });
		}

		const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
		const activeIndex = tabs.findIndex(t => t === activeTab);

		savedState = { tabs: order, activeIndex };
		vscode.window.showInformationMessage(`✅ Cross set! Saved ${order.length} tabs (with content).`);
	});


	const disposableGo = vscode.commands.registerCommand('kunkka.goToCross', async () => {
		if (!savedState || savedState.tabs.length === 0) {
			vscode.window.showWarningMessage('⚠ No Cross set yet.');
			return;
		}

		const groups = vscode.window.tabGroups.all;
		for (const group of groups) {
			await vscode.window.tabGroups.close(group.tabs, true);
		}

		const openedEditors: vscode.TextEditor[] = [];

		for (const state of savedState.tabs) {
			let editor = vscode.window.visibleTextEditors.find(
				e => e.document.uri.toString() === state.uri
			);

			if (!editor) {
				const doc = await vscode.workspace.openTextDocument(vscode.Uri.parse(state.uri));
				editor = await vscode.window.showTextDocument(doc, { preview: false });
			}

			await editor.edit(editBuilder => {
				const fullRange = new vscode.Range(
					editor.document.positionAt(0),
					editor.document.positionAt(editor.document.getText().length)
				);
				editBuilder.replace(fullRange, state.content);
			});

			await editor.document.save();

			if (state.selections.length > 0) {
				editor.selections = state.selections.map(sel => new vscode.Selection(sel.start, sel.end));
			}

			openedEditors.push(editor);
		}


		const activeIndex = savedState.activeIndex;
		if (openedEditors[activeIndex]) {
			await vscode.window.showTextDocument(openedEditors[activeIndex].document, { preview: false });
		}

		vscode.window.showInformationMessage('Returned to Cross state.');
	});


	context.subscriptions.push(disposableSet, disposableGo);
}

export function deactivate() { }
