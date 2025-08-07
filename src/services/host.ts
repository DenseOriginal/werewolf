import { CardId } from "./cards";
import { store } from "@/store";
import { hostActions } from "@/store/host/reducer";
import { updateDoc } from "firebase/firestore/lite";
import { Toastr } from "./toastr";
import { GameDataDB, GameRef, gamesDB } from "./firestore/games";

export class HostService {
	private static _instance: HostService;
	public static get instance(): HostService {
		if (!this._instance) {
			this._instance = new HostService();
		}
		return this._instance;
	}

	private gameDocRef?: GameRef;

	private constructor() { }

	public async createGame() {
		console.log("Creating game");

		store.dispatch(hostActions.setState('creating'));

		const gameRef = await gamesDB.createGame();		
		const createdGame = await gamesDB.getGameByRef(gameRef);
		this.gameDocRef = gameRef;

		const gameData = createdGame.data();

		if (!gameData) {
			Toastr.error("Something bad happened", "The game couldn't be created")
			return;
		}

		store.dispatch(hostActions.setGamePin(gameData.pin));
		store.dispatch(hostActions.setState('settings'));
	}

	public async updateCards(cards: GameDataDB['cards']) {
		if (!this.gameDocRef) {
			console.error("No game started");
			return;
		}

		await gamesDB.updateGame(this.gameDocRef, { cards });
	}

	// Send selected cards to users, Record<UserId, CardId>
	public startGame = (config: Record<string, CardId>) => {
	}

	public resetGame = () => {
	}
}
