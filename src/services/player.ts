import { store } from "@/store";
import { playerActions } from "@/store/player/reducer";
import { GameRef, gamesDB } from "./firestore/games";
import { viewActions } from "@/store/reducer";
import { PlayerRef, playersDB } from "./firestore/players";

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

	private gameDocRef?: GameRef;
	private playerDocRef?: PlayerRef;

	private constructor() { }

	public async connect(gamePin: string) {
		store.dispatch(playerActions.setState('joining'));

		const game = await gamesDB.getGameByPin(gamePin);
		
		if (!game) {
			store.dispatch(viewActions.setView('home'));
			return;
		}
		
		this.gameDocRef = game.ref;

		const friendlyName = fixedPrompt("Choose a player name:");
		const playerRef = await playersDB.createPlayerInGame(game.ref, friendlyName)
		this.playerDocRef = playerRef;		

		store.dispatch(playerActions.setState('playing'));
	}

	public leaveGame() {
		if (!this.gameDocRef) {
			console.error('No game to leave');
			return;
		}
	}
}

const fixedPrompt = (message: string) => {
	let response = prompt(message);

	while (!response) {
		response = prompt(message);
	}

	return response;
}
