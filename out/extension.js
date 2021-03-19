"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const automerge = require("automerge");
const fs_1 = require("fs");
const vscode = require("vscode");
function activate(context) {
    console.log('Congratulations, your extension "a" is now active!');
    let disposable = vscode.commands.registerCommand("a.helloWorld", () => {
        var _a;
        const activeText = ((_a = vscode === null || vscode === void 0 ? void 0 : vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.fileName) || "hyper";
        console.log(activeText);
        let doc = automerge.from({ cards: [] });
        let docStart = fs_1.readFileSync(activeText).toString();
        vscode.workspace.onDidChangeTextDocument((event) => {
            const text = event.contentChanges.map(t => t.text);
            let docStart = automerge.change(doc, 'T1 typed', doc1 => {
                // @ts-ignore
                doc1.cards.push(text);
            });
            console.log(doc.cards);
            console.log(event);
        });
        vscode.window.showInformationMessage("url");
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// test method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map