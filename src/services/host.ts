import { store } from "@/store";
import { hostActions } from "@/store/host/reducer";
import { CardId } from "./cards";
import { PeerMessage } from "@/types";
import { PlayerMessages } from "./player";

export class HostService {
	private static _instancte: HostService;
	public static get instance(): HostService {
		if (!this._instancte) {
			this._instancte = new HostService();
		}
		return this._instancte;
	}

	private gamePin: string;
	private userId: string;
	private wsClient?: WebSocket;
	private users: string[] = [];

	private constructor() {
		this.gamePin = Math.floor(Math.random() * 100000).toString().padEnd(5, "0");
		this.userId = `host:${Math.floor(Math.random() * 100000).toString().padEnd(5, "0")}`;
	}

	private sendMessage = (type: string, content: unknown) => {
		if (!this.wsClient) {
			return;
		}
		const message = {
			userId: this.userId,
			roomId: this.gamePin,
			type,
			content
		}
		this.wsClient.send(JSON.stringify(message));
	}


	public getGamePin(): string {
		return this.gamePin;
	}

	public init() {
		store.dispatch(hostActions.setGamePin(this.gamePin));
		// this.wsClient = new WebSocket("ws://localhost:3000");
		this.wsClient = new WebSocket("wss://frosted-garrulous-decision.glitch.me:");
		this.wsClient.onopen = () => {
			this.sendMessage('createRoom', {});
		}

		this.wsClient.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (!['roomInfo', 'userJoined', 'message', 'userLeft'].includes(message?.type)) {
				return console.error("Invalid message", message);
			}

			switch (message.type) {
				case 'message':
					return this.onMessage(message.userId, message.content);
				case 'userJoined':
					console.log('userJoined', message.userId);
					this.users.push(message.userId);
					return store.dispatch(hostActions.setUsers([...this.users]));
				case 'userLeft':
					console.log('userLeft', message.userId);
					
					this.users = this.users.filter(user => user !== message.userId);
					return store.dispatch(hostActions.setUsers([...this.users]));
				default:
					console.log("Unhandled message :)", message);

			}
		}
	}

	private onMessage = (userId: string, message: PlayerMessages) => {
		console.log("onMessage", userId, message);
	}

	public startGame = () => {
		console.log("startGame");
		this.broadcast(setCard('werewolf'));
	}

	private broadcast = (msg: HostMessage) => {
		console.log("broadcast", msg);
		this.sendMessage('sendMessage', msg);
	}
}

const setCard = (card: CardId): PeerMessage<'SET_CARD', { card: CardId }> => ({
	type: 'SET_CARD',
	data: { card },
});

type MessageCreators =
	| typeof setCard;
export type HostMessage = ReturnType<MessageCreators>;
