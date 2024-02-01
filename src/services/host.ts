import { toPeerId } from "@/stdlib";
import { store } from "@/store";
import { hostActions } from "@/store/host/reducer";
import Peer, { DataConnection } from "peerjs";
import { CardId } from "./cards";
import { PeerMessage } from "@/types";

export class HostService {
	private static _instancte: HostService;
	public static get instance(): HostService {
		if (!this._instancte) {
			this._instancte = new HostService();
		}
		return this._instancte;
	}

	private gamePin: string;
	private peer?: Peer;
	private connections: Record<string, DataConnection> = {};

	private constructor() {
		this.gamePin = Math.floor(Math.random() * 100000).toString().padEnd(5, "0");
	}


	public getGamePin(): string {
		return this.gamePin;
	}

	public init() {
		this.peer = new Peer(toPeerId(this.gamePin));
		this.peer.on("error", err => console.log("Peer error", err));
		this.peer.on("connection", this.onConnection);
		this.peer.on("open", id => console.log("Peer open", id));

		store.dispatch(hostActions.setGamePin(this.gamePin));
	}

	private onConnection = (conn: DataConnection) => {
		console.log("onConnection", conn);
		conn.once("data", (msg) => {
			if (!isJoinMessage(msg)) {
				conn.close();
				console.error("Initial message wasnt 'join'", msg);
				return;
			}

			this.onUserJoin(conn, msg.userId);
		})
		conn.on("open", () => console.log('Connection is open'));
		conn.on("close", () => console.log('Connection is closed'));
		conn.on("error", err => console.log('Connection error', err));
	}

	private onUserJoin = (conn: DataConnection, userId: string) => {
		console.log("onUserJoin", conn, userId);
		conn.on("data", (msg: unknown) => this.onMessage(userId, msg));
		this.connections[userId] = conn;
	}

	private onMessage = (userId: string, message: unknown) => {
		console.log("onMessage", userId, message);
	}

	public startGame = () => {
		console.log("startGame");
		this.broadcast(setCard('werewolf'));
	}

	private broadcast = (msg: HostMessage) => {
		console.log("broadcast", msg);
		Object.values(this.connections).forEach(conn => conn.send(msg));
	}
}

const isJoinMessage = (msg: unknown): msg is { type: "join", userId: string } =>
	!!msg &&
	typeof msg === "object" &&
	"type" in msg &&
	msg.type === "join" &&
	"userId" in msg &&
	typeof msg.userId === "string";

const setCard = (card: CardId): PeerMessage<'SET_CARD', { card: CardId }> => ({
	type: 'SET_CARD',
	data: { card },
});

type MessageCreators =
	| typeof setCard;
export type HostMessage = ReturnType<MessageCreators>;
