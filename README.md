You need to make sure that all the ABI versions line up with the version of VS Code you are using

The repo is currently locked on

VSCode 1.54.3
Electron 11.3.0
Node 12.18.3

Use NPM, I have a lot of issues with Yarn.
Make sure that the variables in .envrc are set so NPM can build the right versions

See https://www.electronjs.org/docs/tutorial/using-native-node-modules#using-npm

(I couldn't get electron-rebuild to work due to a bug in sodium-native's build scripts)
