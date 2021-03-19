import * as automerge from 'automerge';
import { readFileSync } from "fs";
import { v4 } from 'uuid';
import * as vscode from "vscode";
import * as WRTC from "wrtc";
// @ts-ignore
import Network from "./network";


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "a" is now active!');
	

	let disposable = vscode.commands.registerCommand("a.helloWorld", () => {
    const activeText =
    vscode?.window.activeTextEditor?.document.fileName || "hyper";
    console.log(activeText);


	let listeners = []
	console.log(1)
	let state = automerge.change(automerge.init(), "new document", (doc) => {
		// @ts-ignore
		doc.docId = v4()
	  })
	  let docSet    = new automerge.DocSet()
	  docSet.setDoc( state.docId,  state)
	  console.log(4)
	  docSet.registerHandler((docId, doc) => {
		  console.log("asdfasd")
		})
		
		let network =  new Network( docSet, WRTC)
		console.log(2)
		network.connect({
			// we use our automerge session ID as the peer id,
			// but we probably want to use the network ID for the document actorIds
			//   @ts-ignore
			name: "test",
			peerId:  "actorId"
		})
		console.log(3)


    let docStart = readFileSync(activeText).toString();
	
	let doc = automerge.from({text: new automerge.Text(docStart)})

    vscode.workspace.onDidChangeTextDocument((event) => {


	doc = automerge.change(doc, 'T1 typed', state =>{ 
		event.contentChanges.forEach((change) => {
			if (change.text === "") {
				state.text.deleteAt?.(change.rangeOffset, change.rangeLength);
			} else {
				state.text.insertAt?.(
				change.rangeOffset,
				...Array.from(change.text)
			  );
			}
		  })
	});
	console.log(doc.text)
    });

    vscode.window.showInformationMessage("url");
  });

  context.subscriptions.push(disposable);
}

// test method is called when your extension is deactivated
export function deactivate() {}
