import * as vscode from 'vscode';

interface EditorState {
	uri: string;
	selections: { start: vscode.Position; end: vscode.Position }[];
}
interface CrossState {
	tabs: EditorState[];
	activeIndex: number;
}

let savedState: CrossState | null = null;

export function activate(context: vscode.ExtensionContext) {
	const disposableSet = vscode.commands.registerCommand('kunkka.setCross', () => {
		const tabs = vscode.window.tabGroups.all.flatMap(group => group.tabs);
		const order: EditorState[] = [];

		tabs.forEach((tab, i) => {
			const uri = (tab.input as any)?.uri as vscode.Uri;
			if (!uri) {
				return;
			}

			const openEditor = vscode.window.visibleTextEditors.find(ed => ed.document.uri.toString() === uri.toString());
			const selections = openEditor ? openEditor.selections.map(sel => ({
				start: sel.start,
				end: sel.end
			})) : [];

			order.push({ uri: uri.toString(), selections });
		});

		const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
		const activeIndex = tabs.findIndex(t => t === activeTab);

		savedState = { tabs: order, activeIndex };
		vscode.window.showInformationMessage(`Cross set! Saved ${order.length} tabs.`);

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

		for (let i = 0; i < savedState.tabs.length; i++) {
			const state = savedState.tabs[i];
			const doc = await vscode.workspace.openTextDocument(vscode.Uri.parse(state.uri));
			const editor = await vscode.window.showTextDocument(doc, { preview: false });
			editor.selections = state.selections.map(sel => new vscode.Selection(sel.start, sel.end));
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
