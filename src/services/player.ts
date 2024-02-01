import { toPeerId } from "@/stdlib";
import Peer, { DataConnection } from "peerjs";
import { HostMessage } from "./host";
import { store } from "@/store";
import { playerActions } from "@/store/player/reducer";

export class PlayerService {
	private static _instancte: PlayerService;
	public static get instance(): PlayerService {
		if (!this._instancte) {
			this._instancte = new PlayerService();
		}
		return this._instancte;
	}

	private peer?: Peer;
	private connection?: DataConnection;
	private userId?: string;
	private constructor() { }

	public connect(gamePin: string) {
		this.userId = `user-${Math.floor(Math.random() * 100000)}`;
		this.peer = new Peer(this.userId);
		this.peer.on("error", err => console.log("Peer error", err));
		if (!this.peer) {
			return;
		}

		setTimeout(() => {
			if (!this.peer) {
				console.error("Peer is not initialized");
				return;
			}

			console.log("Connecting", toPeerId(gamePin));
			const connection = this.peer.connect(
				toPeerId(gamePin),
				// { metadata: { userId: this.userId } }
			);
			connection.on("iceStateChanged", state => console.log("iceStateChanged", state));
			connection.on("error", err => console.log("Connection error", err));
			connection.on("open", () => this.onConnection(connection))
		}, 1000);
	}

	private onConnection = (conn: DataConnection) => {
		console.log("onConnection", conn);
		this.connection = conn;
		conn.on("data", (msg: unknown) => this.onMessage(msg as HostMessage));
		conn.on("close", () => console.log('Connection is closed'));

		this.connection.send({ type: "join", userId: this.userId });
	}

	private onMessage = (message: HostMessage) => {
		console.log("onMessage", message);

		switch (message?.type) {
			case 'SET_CARD':
				store.dispatch(playerActions.setCard(message.data.card));
		}
	}
}
