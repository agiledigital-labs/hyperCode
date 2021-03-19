import * as automerge from 'automerge';
import { readFileSync } from "fs";
import * as vscode from "vscode";


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "a" is now active!');
	

	let disposable = vscode.commands.registerCommand("a.helloWorld", () => {
    const activeText =
    vscode?.window.activeTextEditor?.document.fileName || "hyper";
    console.log(activeText);

	let doc = automerge.from({cards: []})



    let docStart = readFileSync(activeText).toString();


    vscode.workspace.onDidChangeTextDocument((event) => {

		const text  =event.contentChanges.map(t => t.text)

	let docStart = automerge.change(doc, 'T1 typed', doc1 =>{ 
		// @ts-ignore
		doc1.cards.push(text)
	});

	console.log(doc.cards)
      console.log(event);
    });

    vscode.window.showInformationMessage("url");
  });

  context.subscriptions.push(disposable);
}

// test method is called when your extension is deactivated
export function deactivate() {}
