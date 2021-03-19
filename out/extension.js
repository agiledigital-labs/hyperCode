"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const automerge = require("automerge");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
const vscode = require("vscode");
const WRTC = require("wrtc");
// @ts-ignore
const network_1 = require("./network");
function activate(context) {
    console.log('Congratulations, your extension "a" is now active!');
    let disposable = vscode.commands.registerCommand("a.helloWorld", () => {
        var _a;
        const activeText = ((_a = vscode === null || vscode === void 0 ? void 0 : vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.fileName) || "hyper";
        console.log(activeText);
        let listeners = [];
        console.log(1);
        let state = automerge.change(automerge.init(), "new document", (doc) => {
            // @ts-ignore
            doc.docId = uuid_1.v4();
        });
        let docSet = new automerge.DocSet();
        docSet.setDoc(state.docId, state);
        console.log(4);
        docSet.registerHandler((docId, doc) => {
            console.log("asdfasd");
        });
        let network = new network_1.default(docSet, WRTC);
        console.log(2);
        network.connect({
            // we use our automerge session ID as the peer id,
            // but we probably want to use the network ID for the document actorIds
            //   @ts-ignore
            name: "test",
            peerId: "actorId"
        });
        console.log(3);
        let docStart = fs_1.readFileSync(activeText).toString();
        let doc = automerge.from({ text: new automerge.Text(docStart) });
        vscode.workspace.onDidChangeTextDocument((event) => {
            doc = automerge.change(doc, 'T1 typed', state => {
                event.contentChanges.forEach((change) => {
                    var _a, _b, _c, _d;
                    if (change.text === "") {
                        (_b = (_a = state.text).deleteAt) === null || _b === void 0 ? void 0 : _b.call(_a, change.rangeOffset, change.rangeLength);
                    }
                    else {
                        (_d = (_c = state.text).insertAt) === null || _d === void 0 ? void 0 : _d.call(_c, change.rangeOffset, ...Array.from(change.text));
                    }
                });
            });
            console.log(doc.text);
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