import * as vscode from 'vscode';
import * as ts from "typescript";

function eval_code(lang: string, code: string) {
	let eval_command = code;
	if (["ts", "typescript"].includes(lang)) {
		eval_command = ts.transpile(code);
	}
	try {
		// don't use Function(). Because Function() use exports inside
		eval(eval_command);
	} catch (error) {
		let result = error.toString();
		console.log('vscode-extension-eval.action: eval result:', result);
		vscode.window.showInformationMessage('vscode-extension-eval.action: error:', result);
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-extension-eval" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-extension-eval.action', (arg?: any) => {
			if (arg === undefined) {
				// set default values
				arg = { lang: "ts", command: "" };
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					const selection = editor.selection;
					var text = editor.document.getText(selection);
					if (selection.isEmpty) {
						text = editor.document.getText();
					}
					arg.command = text;
				}
			}

			let command = "";
			let lang = "ts";
			if (typeof arg.lang === "string") {
				lang = arg.lang;
				const langs = ["ts", "typescript", "js", "javascript"];
				if (!langs.includes(lang)) {
					vscode.window.showInformationMessage('vscode-extension-eval.action: unknown "args.lang"', lang);
					return;
				}
			}
			if (typeof arg.command === "object") {
				command = arg.command.join("\n");
			} else if (typeof arg.command === "string") {
				command = arg.command;
			}
			if (command === "") {
				vscode.window.showInformationMessage('vscode-extension-eval.action: set "args.command"');
				return;
			}
			console.log('vscode-extension-eval.action: eval:', command);
			eval_code(lang, command);
		})
	);
}

export function deactivate() { }
