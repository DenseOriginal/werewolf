import { HostMessage } from "./host";
import { store } from "@/store";
import { playerActions } from "@/store/player/reducer";
import { PeerMessage } from "@/types";

export class PlayerService {
	private static _instancte: PlayerService;
	public static get instance(): PlayerService {
		if (!this._instancte) {
			this._instancte = new PlayerService();
		}
		return this._instancte;
	}

	private wsClient?: WebSocket;
	private userId?: string;
	private gamePin?: string;

	private constructor() {
		const userId = localStorage.getItem("userId");
		if (!userId) {
			const newId = `user:${Math.floor(Math.random() * 100000)}`;
			localStorage.setItem("userId", newId);
			this.userId = newId;
		} else {
			this.userId = userId;
		}
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

	public connect(gamePin: string) {
		this.gamePin = gamePin;
		this.wsClient = new WebSocket("wss://frosted-garrulous-decision.glitch.me:");
		// this.wsClient = new WebSocket("ws://localhost:3000");
		this.wsClient.onopen = () => {
			this.sendMessage('joinRoom', {});
		}

		this.wsClient.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (!['roomInfo', 'userJoined', 'message'].includes(message?.type)) {
				return console.error("Invalid message", message);
			}

			if (message.type == 'message') {
				return this.onMessage(message.content);
			}

			console.log("Unhandled message :)", message);
		}
	}

	private onMessage = (message: HostMessage) => {
		console.log("onMessage", message);

		switch (message?.type) {
			case 'SET_CARD':
				store.dispatch(playerActions.setCard(message.data.card));
		}
	}
}

const ping = (): PeerMessage<'PING', never> => ({
	type: 'PING',
	data: {} as never,
});

type MessageCreators =
	| typeof ping;
export type PlayerMessages = ReturnType<MessageCreators>;

