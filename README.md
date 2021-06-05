# vscode-extension-eval

## Features
* You can typescript/javascript code from `keybindings.json` or the current editor.
  * You can easily wrap other extension commands at `keybindings.json`.
* If you run `EVAL ACTION: Eval Code selection or entire document` from command pallet, target code is current selection or entire editor document.

## Requirements
nothing

## how to run

Paste below code to editor and run `EVAL ACTION: Eval Code selection or entire document` from command pallet.

``` typescript
vscode.window.showInformationMessage('hello1!');
vscode.window.showInformationMessage('hello2!');
vscode.window.showInformationMessage('hello3!');
vscode.window.showInformationMessage('hello4!');
```

### Extension Settings for `keybindings.json`

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

convert command (sed is gnu sed)
``` bash
function vscode-extension-eval-encoder() {
  echo '['
  sed 's/'$'\t''/    /g' | sed 's/"/\\"/g' | sed -e 's/^/"/' -e 's/$/",/'
  echo ']'
}

function vscode-extension-eval-decoder() {
  sed -E 's/^ *([\["]|\])|",$//g' | sed '1{/^$/d}; ${/^$/d}'
}
```

`keybindings.json`
``` json
  {
    "key": "ctrl+s",
    "command": "vscode-extension-eval.action",
    "when": "editorFocus",
    "args": {
      "lang": "ts", // typescript, js, javascript
      "command": [ // array of string or simply one line string is ok: "vscode.commands.executeCommand('vim-search-and-replace.start', 'hogehgoe');"
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

e.g. reverse `expandLineSelection` (`cmd+l`)
``` json
{
  "key": "cmd+shift+l",
  "command": "vscode-extension-eval.action",
  "when": "editorHasSelection",
  "args": {
    "lang": "ts",
    "command": [
    "function clamp(value: number, min: number, max: number): number {",
    "  return Math.min(Math.max(value, min), max);",
    "}",
    "const editor = vscode.window.activeTextEditor!;",
    "const document = editor.document;",
    "const selection = editor.selection;",
    "const startLine = document.lineAt(",
    "  clamp(selection.start.line - 1, 0, document.lineCount - 1)",
    ");",
    "editor.selection = new vscode.Selection(",
    "  startLine.range.start,",
    "  selection.end",
    ");",
    ]
  },
},
```
