"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const bonjour_signaler_1 = require("./network/bonjour-signaler");
const peer_stats_1 = require("./network/peer-stats");
const peergroup_1 = require("./network/peergroup");
const webrtc_signaler_1 = require("./network/webrtc-signaler");
class Network extends EventEmitter {
    constructor(docSet, wrtc) {
        super();
        this.peergroup = new peergroup_1.default(docSet, wrtc);
        this.signaler = new bonjour_signaler_1.default(this.peergroup);
        this.webRTCSignaler = new webrtc_signaler_1.default(this.peergroup);
        this.peerStats = new peer_stats_1.default(this.peergroup);
        this.connected = false;
    }
    connect(config) {
        if (this.connected)
            throw "network already connected - disconnect first";
        // allow connect without a config to use the previous connect's config.
        this.config = config || this.config;
        // we define "connect" and "disconnect" for ourselves as whether
        // we're connected to the signaller.
        this.signaler.on("connect", () => {
            this.peergroup.self().emit("connect");
        });
        this.signaler.on("disconnect", () => {
            this.peergroup.self().emit("disconnect");
        });
        let name = this.config.name || process.env.NAME;
        let peerId = this.config.peerId;
        if (!peerId)
            throw new Error("peerId required, not found in config");
        this.peergroup.join(peerId, name);
        this.signaler.start();
        this.connected = true;
    }
    broadcastActiveDocId(docId) {
        this.webRTCSignaler.broadcastActiveDocId(docId);
    }
    getPeerDocs() {
        return this.webRTCSignaler.getPeerDocs();
    }
    disconnect() {
        if (this.connected == false)
            throw "network already disconnected - connect first";
        console.log("NETWORK DISCONNECT");
        this.signaler.stop();
        this.peergroup.close();
        this.connected = false;
    }
}
exports.default = Network;
//# sourceMappingURL=network.js.map