"use strict";
/// <reference types="@seandawson/hypermerge/src/types/hyperswarm" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const automerge = require("automerge");
const vscode = require("vscode");
const hypermerge_1 = require("@seandawson/hypermerge");
const Hyperswarm = require("hyperswarm");
const path = ".data";
const repo = new hypermerge_1.Repo({ path });
const swarm = Hyperswarm({ queue: { multiplex: true } });
repo.addSwarm(swarm, { announce: true });
function activate(context) {
    console.log('Congratulations, your extension "hypercode" is now active!');
    context.subscriptions.push(vscode.commands.registerCommand("hypercode.start", () => {
        const url = repo.create({
            text: new automerge.Text(),
        });
        vscode.window.showInformationMessage(`Url is [${url}]`);
        vscode.workspace.onDidChangeTextDocument((event) => {
            repo.change(url, (state) => {
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
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand("hypercode.join", () => {
        vscode.window
            .showInputBox({
            prompt: "Enter the HyperCode URL",
        })
            .then((url) => {
            if (url === undefined) {
                vscode.window.showWarningMessage("URL is required");
                return;
            }
            // They seem to cast in the chat example, but it seems weird
            repo.doc(url, (state) => {
                var _a;
                (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.edit((editBuilder) => editBuilder.replace(new vscode.Position(0, 0), state.text.toString()));
                state.text.toString();
            });
        });
    }));
}
exports.activate = activate;
// test method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map