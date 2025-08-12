import { store } from "@/store";
import { playerActions } from "@/store/player/reducer";
import { GameRef, gamesDB } from "./firestore/games";
import { viewActions } from "@/store/reducer";
import { PlayerRef, playersDB } from "./firestore/players";
import { Unsubscribe, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/firebase/init";
import { onKicked } from "@/store/player/thunks";
import { Toastr } from "./toastr";

const auth = getAuth(firebaseApp);

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

		const isPlayerInGame = await playersDB.isPlayerInGame(game.ref);
		if (isPlayerInGame) {
			this.playerDocRef = playersDB.getPlayerDocumentRef(game.ref, auth.currentUser!.uid);
		} else {
			const friendlyName = fixedPrompt("Choose a player name:");
			const playerRef = await playersDB.createPlayerInGame(game.ref, friendlyName)
			this.playerDocRef = playerRef;
		}

		store.dispatch(playerActions.setState('playing'));

		this.setupPlayerListeners();
	}

	private playerListenerUnsubscribe?: Unsubscribe;
	private setupPlayerListeners() {
		this.playerListenerUnsubscribe?.();
		
		if (!this.gameDocRef) {
			throw new Error("Game not initialized, can't setup listeners");
		}

		if (!this.playerDocRef) {
			throw new Error("Player not initialized, can't setup listeners");
		}

		this.playerListenerUnsubscribe = onSnapshot(this.playerDocRef, (snapshot) => {
			const playerData = snapshot.data();
			
			if (!snapshot.exists()) {
				Toastr.warn("You have been kicked from the game");
				this.playerListenerUnsubscribe?.();
				return store.dispatch(onKicked());
			}

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

	public async leaveGame() {
		if (!this.playerDocRef) {
			console.error('No game to leave');
			return;
		}

		this.playerListenerUnsubscribe?.();
		await playersDB.deletePlayer(this.playerDocRef);
	}
}

const fixedPrompt = (message: string) => {
	let response = prompt(message);

	while (!response) {
		response = prompt(message);
	}

	return response;
}
