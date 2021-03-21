/// <reference types="@seandawson/hypermerge/src/types/hyperswarm" />

import * as automerge from "automerge";
import * as vscode from "vscode";

import { DocUrl, Repo } from "@seandawson/hypermerge";
import * as Hyperswarm from "hyperswarm";

const path = ".data";
const repo = new Repo({ path });

const swarm = Hyperswarm({ queue: { multiplex: true } });
repo.addSwarm(swarm, { announce: true });

type State = {
  text: automerge.Text;
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "hypercode" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("hypercode.start", () => {
      const url = repo.create({
        text: new automerge.Text(),
      });

      vscode.window.showInformationMessage(`Url is [${url}]`);

      vscode.workspace.onDidChangeTextDocument((event) => {
        repo.change(url, (state: State) => {
          event.contentChanges.forEach((change) => {
            if (change.text === "") {
              state.text.deleteAt?.(change.rangeOffset, change.rangeLength);
            } else {
              state.text.insertAt?.(
                change.rangeOffset,
                ...Array.from(change.text)
              );
            }
          });
        });
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("hypercode.join", () => {
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
          repo.doc(url as DocUrl, (state: State) => {
            vscode.window.activeTextEditor?.edit((editBuilder) =>
              editBuilder.replace(
                new vscode.Position(0, 0),
                state.text.toString()
              )
            );
            state.text.toString();
          });
        });
    })
  );
}

// test method is called when your extension is deactivated
export function deactivate() {}
