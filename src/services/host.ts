import { store } from "@/store";
import { hostActions, hostInitialState } from "@/store/host/reducer";
import { CardId } from "./cards";
import { PeerMessage } from "@/types";
import { PlayerMessages } from "./player";
import { getWsClient } from "./ws";
import { HostState } from "@/store/types";

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

	private constructor() {
		this.gamePin = Math.floor(Math.random() * 100000).toString().padEnd(5, "0");
		this.userId = `host:${Math.floor(Math.random() * 100000).toString().padEnd(5, "0")}`;

		store.subscribe(() => {
			const state = store.getState().host;
			localStorage.setItem('hostSettings', JSON.stringify(state));
		})
	}

	private sendMessage = (type: string, content: unknown, extra = {}) => {
		if (!this.wsClient) {
			return;
		}
		const message = {
			userId: this.userId,
			roomId: this.gamePin,
			type,
			content,
			...extra,
		}
		this.wsClient.send(JSON.stringify(message));
	}


	public getGamePin(): string {
		return this.gamePin;
	}

	public init() {
		store.dispatch(hostActions.setState('creating'));
		store.dispatch(hostActions.setGamePin(this.gamePin));

		this.wsClient = getWsClient();
		this.wsClient.onopen = () => {
			this.sendMessage('createRoom', {});
		}

		this.setupWsClient();
	}

	public rejoin() {

	}

	private loadSettings = () => {
		const rawSettings = localStorage.getItem('hostSettings') || '{}';
		const settings = JSON.parse(rawSettings) as Partial<HostState> | undefined;

		const patchedSettings: HostState = {
			...hostInitialState,
			gamePin: settings?.gamePin || this.gamePin,
			users: settings?.users || [],
			game: {
				cards: settings?.game?.cards || {},
				userCards: settings?.game?.userCards || {},
			}
		}

		return patchedSettings;
	}

	private setupWsClient = () => {
		if (!this.wsClient) {
			return;
		}

		this.wsClient.onmessage = (event) => {
			const message = JSON.parse(event.data);

			switch (message.type) {
				case 'message':
					return this.onMessage(message.userId, message.content);
				case 'userJoined':
					console.log('userJoined', message.userId);
					this.sendToUser(message.userId, welcomeUser(message.userId));
					return store.dispatch(hostActions.addUser({ name: message.name, userId: message.userId }));
				case 'userLeft':
					console.log('userLeft', message.userId);
					return store.dispatch(hostActions.updateUserStatus({
						userId: message.userId,
						active: false
					}));

				case 'roomCreated':
					console.log('roomCreated', message);
					store.dispatch(hostActions.setState('settings'));
					break;

				case 'rejoined':
					console.log('Rejoined as host', message);
					store.dispatch(hostActions.setState('settings'));
					store.dispatch(hostActions.loadStateFromStorage(this.loadSettings()));
					store.dispatch(hostActions.setUsers(message.users));
					break;

				default:
					return console.error("Invalid message", message);
			}
		}
	}

	private onMessage = (userId: string, message: PlayerMessages) => {
		console.log("onMessage", userId, message);
	}

	// Send selected cards to users, Record<UserId, CardId>
	public startGame = (config: Record<string, CardId>) => {
		console.log("startGame", config);
		Object.entries(config).forEach(([userId, card]) => this.sendToUser(userId, setCard(card)));
	}

	public resetGame = () => {
		console.log("resetGame");
		this.broadcast(resetGame());
	}

	private broadcast = (msg: HostMessage) => {
		console.log("broadcast", msg);
		this.sendMessage('sendMessage', msg);
	}

	private sendToUser = (userId: string, msg: HostMessage) => {
		console.log("sendToUser", userId, msg);
		this.sendMessage(
			'sendPrivateMessage',
			msg,
			{ targetUserId: userId }
		);
	}
}

const setCard = (card: CardId): PeerMessage<'SET_CARD', { card: CardId }> => ({
	type: 'SET_CARD',
	data: { card },
});

const resetGame = (): PeerMessage<'RESET_GAME', never> => ({
	type: 'RESET_GAME',
	data: {} as never,
});

const welcomeUser = (userId: string): PeerMessage<'WELCOME', { userId: string }> => ({
	type: 'WELCOME',
	data: { userId },
});

type MessageCreators =
	| typeof setCard
	| typeof resetGame
	| typeof welcomeUser;
export type HostMessage = ReturnType<MessageCreators>;
