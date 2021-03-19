"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Automerge = require("automerge");
const EventEmitter = require("events");
const peer_1 = require("./peer");
class PeerGroup extends EventEmitter {
    constructor(docSet, wrtc) {
        super();
        this.docSet = docSet;
        this.wrtc = wrtc;
        this.Peers = {};
        this.connections = {};
        this.processSignal = this.processSignal.bind(this);
    }
    join(session, name) {
        // add ourselves to the peers list with a do-nothing signaller
        // this has to happen after all the listeners register... which suggests
        // we have some kind of an antipattern going
        this.me = this.getOrCreatePeer(session, name, undefined);
    }
    close() {
        for (let id in this.Peers) {
            this.Peers[id].close();
            delete this.Peers[id];
        }
    }
    peers() {
        return Object.values(this.Peers);
    }
    self() {
        return this.me;
    }
    getOrCreatePeer(id, name, handler) {
        if (!this.Peers[id]) {
            let peer = new peer_1.default(id, name, handler, this.wrtc);
            this.Peers[id] = peer;
            this.connections[id] = new Automerge.Connection(this.docSet, (msg) => {
                console.log("send to " + id + ":", msg);
                peer.send(msg);
            });
            peer.on("message", (msg) => {
                console.log("receive from " + id + ":", msg);
                this.connections[id].receiveMsg(msg);
            });
            peer.on("closed", () => {
                this.connections[id].close();
                delete this.connections[id];
                delete this.Peers[id];
            });
            this.connections[id].open();
            this.emit("peer", peer);
        }
        return this.Peers[id];
    }
    processSignal(msg, signal, handler) {
        let id = msg.session;
        if (!id)
            throw new Error("Tried to process a signal that had no peer ID");
        let name = msg.name;
        let peer;
        switch (msg.action) {
            case "hello":
                // on a "hello" we throw out the peer
                if (this.Peers[id])
                    console.log("ALREADY HAVE A PEER UNDERWAY - NEW HELLO - RESET", id);
                delete this.Peers[id];
                peer = this.getOrCreatePeer(id, name, handler);
                peer.establishDataChannel();
                break;
            case "offer":
                // on an "offer" we can create a peer if we don't have one
                // but this is might get wonky, since it could be a peer that's trying to reconnect
                peer = this.getOrCreatePeer(id, name, handler);
                peer.handleSignal(signal);
                break;
            case "reply":
                peer = this.Peers[id]; // we definitely don't want replies for unknown peers.
                if (!peer)
                    throw "Received an offer or a reply for a peer we don't have registered.";
                peer.handleSignal(signal);
                break;
            default:
                throw new Error("Unrecognized signal:", signal);
        }
    }
}
exports.default = PeerGroup;
//# sourceMappingURL=peergroup.js.map