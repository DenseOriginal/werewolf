import { HostMessage } from "./host";
import { store } from "@/store";
import { playerActions } from "@/store/player/reducer";
import { PeerMessage } from "@/types";
import { getWsClient } from "./ws";

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
		this.wsClient = getWsClient();
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
				return store.dispatch(playerActions.setCard(message.data.card));
			case 'RESET_GAME':
				return store.dispatch(playerActions.resetGame());
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

