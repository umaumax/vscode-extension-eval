# vscode-extension-eval

## Features
* `keybinding.json`からtypescriptのコードを`eval`して呼び出す
  * 他の拡張機能の提供するAPIを簡単にwrapして呼び出す事が可能となる

## Requirements
nothing

## Extension Settings

e.g. wrap `vim-search-and-replace.start` command

see [Vim Search and Replace \- Visual Studio Marketplace]( https://marketplace.visualstudio.com/items?itemName=nlehmann.vscode-vim-search-and-replace )

src file
``` ts
import { TextEditor, Selection } from 'vscode';
function selectWordAtCursorPosition(editor: TextEditor): boolean {
	if (!editor.selection.isEmpty) {
		return true;
	}
	const cursorWordRange = editor.document.getWordRangeAtPosition(editor.selection.active);
	if (!cursorWordRange) {
		return false;
	}
	const newSe = new Selection(cursorWordRange.start.line, cursorWordRange.start.character, cursorWordRange.end.line, cursorWordRange.end.character);
	editor.selection = newSe;
	return true;
}
(() => {
	const editor = vscode.window.activeTextEditor!;
	if (!editor) { return; }
	let word = '';
	if (editor.selection.isEmpty) {
		if (!selectWordAtCursorPosition(editor)) {
			vscode.window.showInformationMessage('vscode-extension-eval: Can not get word at cursor!');
			return;
		}
	}
	word = editor.document.getText(editor.selection);
	console.log('vscode-extension-eval: word is', word);
	vscode.commands.executeCommand('vim-search-and-replace.start', word);
	vscode.window.showInformationMessage('vscode-extension-eval: use ctrl+j or ctrl+k');
})();
```

convert command
``` bash
echo '['
sed 's/'$'\t''/    /g' | sed 's/"/\\"/g' | sed -e 's/^/"/' -e 's/$/",/'
echo ']'
```

`keybindings.json`
``` json
  {
    "key": "ctrl+s",
    "command": "vscode-extension-eval.action",
    "when": "editorFocus",
    "args": {
      "lang": "ts",
      "command": [
        "import { TextEditor, Selection } from 'vscode';",
        "function selectWordAtCursorPosition(editor: TextEditor): boolean {",
        "    if (!editor.selection.isEmpty) {",
        "        return true;",
        "    }",
        "    const cursorWordRange = editor.document.getWordRangeAtPosition(editor.selection.active);",
        "    if (!cursorWordRange) {",
        "        return false;",
        "    }",
        "    const newSe = new Selection(cursorWordRange.start.line, cursorWordRange.start.character, cursorWordRange.end.line, cursorWordRange.end.character);",
        "    editor.selection = newSe;",
        "    return true;",
        "}",
        "(() => {",
        "    const editor = vscode.window.activeTextEditor!;",
        "    if (!editor) { return; }",
        "    let word = '';",
        "    if (editor.selection.isEmpty) {",
        "        if (!selectWordAtCursorPosition(editor)) {",
        "            vscode.window.showInformationMessage('vscode-extension-eval: Can not get word at cursor!');",
        "            return;",
        "        }",
        "    }",
        "    word = editor.document.getText(editor.selection);",
        "    console.log('word is', word);",
        "    vscode.commands.executeCommand('vim-search-and-replace.start', word);",
        "    vscode.window.showInformationMessage('vscode-extension-eval: use ctrl+j or ctrl+k');",
        "})();",
        ]
    },
  }
```
