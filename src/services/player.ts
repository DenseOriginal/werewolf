import { HostMessage } from "./host";
import { store } from "@/store";
import { playerActions } from "@/store/player/reducer";
import { PeerMessage } from "@/types";
import { getWsClient } from "./ws";
import { viewActions } from "@/store/reducer";
import { Toastr } from "./toastr";

interface UserSettings {
	userId: string;
	name: string;
}

export class PlayerService {
	private static _instance?: PlayerService;
	public static get instance(): PlayerService {
		if (!this._instance) {
			this._instance = new PlayerService();
		}
		return this._instance;
	}
	public static destroy() {
		this._instance = undefined;
	}

	private wsClient?: WebSocket;
	private gamePin?: string;
	private settings: UserSettings;

	private constructor() {
		this.settings = this.getUserSettings();
	}

	private getUserSettings = () => {
		const rawSettings = localStorage.getItem("userSettings") || "{}";
		const settings: Partial<UserSettings> = JSON.parse(rawSettings);

		const patchedSettings: UserSettings = {
			userId: `user:${Math.floor(Math.random() * 100000)}`,
			name: settings.name || fixedPrompt("Please enter your name"),
			...settings,
		}

		localStorage.setItem("userSettings", JSON.stringify(patchedSettings));
		return patchedSettings;
	}

	private sendMessage = (type: string, content: unknown) => {
		if (!this.wsClient) {
			return;
		}
		const message = {
			userId: this.settings.userId,
			roomId: this.gamePin,
			type,
			content
		}
		this.wsClient.send(JSON.stringify(message));
	}

	public connect(gamePin: string) {
		this.gamePin = gamePin;

		store.dispatch(playerActions.setState('joining'));

		this.wsClient = getWsClient();
		this.wsClient.onopen = () => {
			this.sendMessage('joinRoom', { name: this.settings.name });
		}

		this.wsClient.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (!['roomInfo', 'userJoined', 'message', 'unknownRoom'].includes(message?.type)) {
				return console.error("Invalid message", message);
			}

			switch (message.type) {
				case 'message':
					return this.onMessage(message.content);
				case 'unknownRoom':
					store.dispatch(viewActions.setView('home'));
					Toastr.error("Unknown room", "The room you are trying to join does not exist");
					return PlayerService.destroy();
					
				default:
					console.log("Unhandled message :)", message);
					break;
			}

		}
	}

	private onMessage = (message: HostMessage) => {
		console.log("onMessage", message);

		switch (message?.type) {
			case 'SET_CARD':
				return store.dispatch(playerActions.setCard(message.data.card));
			case 'RESET_GAME':
				return store.dispatch(playerActions.resetGame());
			case 'WELCOME':
				if (message.data.userId == this.settings.userId) {
					return store.dispatch(playerActions.setState('playing'));
				}
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

const fixedPrompt = (message: string) => {
	let response = prompt(message);

	while (!response) {
		response = prompt(message);
	}

	return response;
}
