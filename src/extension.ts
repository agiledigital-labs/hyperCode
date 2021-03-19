// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Repo } from "hypermerge";
import Hyperswarm from "hyperswarm";
import * as vscode from "vscode";



export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "a" is now active!');
	
	let disposable = vscode.commands.registerCommand("a.helloWorld", () => {
		const activeText =
		vscode?.window.activeTextEditor?.document.fileName || "hyper";
		console.log(activeText);
		const repo = new Repo({ activeText });
    repo.setSwarm(Hyperswarm());

    const url = repo.create({ hello: "world" });

    // const docStart = readFileSync(activeText).toString();

    // repo.doc(url, (doc: any) => console.log(doc));

    // repo.change(url, (state: any) => (state.start = docStart));

    // repo.doc(url, (doc: any) => console.log(doc));

    // The code you place here will be executed every time your command is executed

    vscode.workspace.onDidChangeTextDocument((event) => {
      console.log(event);
    });
	
    vscode.window.showInformationMessage(url);
  });

  context.subscriptions.push(disposable);
}

// test method is called when your extension is deactivated
export function deactivate() {}
