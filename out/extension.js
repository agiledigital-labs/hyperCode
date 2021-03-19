"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const hypermerge_1 = require("hypermerge");
// import Hyperswarm from "hyperswarm";
const vscode = require("vscode");
const path = ".data";
const repo = new hypermerge_1.Repo({ memory: true, path: ".test" });
function activate(context) {
    console.log('Congratulations, your extension "a" is now active!');
    let disposable = vscode.commands.registerCommand("a.helloWorld", () => {
        // const activeText =
        // vscode?.window.activeTextEditor?.document.fileName || "hyper";
        // console.log(activeText);
        // repo.setSwarm(Hyperswarm());
        const url = repo.create({ hello: "world", });
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
exports.activate = activate;
// test method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map