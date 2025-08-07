import { store } from "@/store";
import { playerActions } from "@/store/player/reducer";
import { GameRef, gamesDB } from "./firestore/games";
import { viewActions } from "@/store/reducer";
import { PlayerRef, playersDB } from "./firestore/players";
import { setURLHash } from "@/stdlib/url";
import { onSnapshot } from "firebase/firestore";

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
		setURLHash(game.data().pin);

		this.setupPlayerListeners();
	}

	private setupPlayerListeners() {
		if (!this.gameDocRef) {
			throw new Error("Game not initialized, can't setup listeners");
		}

		if (!this.playerDocRef) {
			throw new Error("Player not initialized, can't setup listeners");
		}

		onSnapshot(this.playerDocRef, (snapshot) => {
			const playerData = snapshot.data();
			
			if (!playerData) {
				console.error("Player data not found");
				return;
			}

			if (!playerData.role) {
				store.dispatch(playerActions.resetGame());
				return;
			} else {
				store.dispatch(playerActions.setCard(playerData.role));
			}
		});
	}

	public leaveGame() {
		if (!this.gameDocRef) {
			console.error('No game to leave');
			return;
		}

		setURLHash("");
	}
}

const fixedPrompt = (message: string) => {
	let response = prompt(message);

	while (!response) {
		response = prompt(message);
	}

	return response;
}
