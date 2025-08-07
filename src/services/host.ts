import { CardId } from "./cards";
import { store } from "@/store";
import { hostActions } from "@/store/host/reducer";
import { onSnapshot } from "firebase/firestore";
import { Toastr } from "./toastr";
import { GameDataDB, GameRef, gamesDB } from "./firestore/games";
import { playersDB } from "./firestore/players";
import { setURLHash } from "@/stdlib/url";

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
		setURLHash(`!${gameData.pin}`);
		
		this.setupGameListeners();
	}
	
	private async setupGameListeners() {
		if (!this.gameDocRef) {
			throw new Error("Game not started yet, cant setup listeners");
		}
		
		const playerCollectionRef = playersDB.getPlayerCollection(this.gameDocRef);
		onSnapshot(playerCollectionRef, (snapshot) => {
			snapshot.docChanges().forEach(change => {
				const data = change.doc.data();
				if (change.type == 'added') {
					Toastr.info(`${data.name} has joined to room`);
					store.dispatch(hostActions.addUser({
						name: data.name.toString(),
						userId: data.userId.toString()
					}))
				}
			});
		});
	}

	public async updateCards(cards: GameDataDB['cards']) {
		if (!this.gameDocRef) {
			console.error("No game started");
			return;
		}

		await gamesDB.updateGame(this.gameDocRef, { cards });
	}

	// Send selected cards to users, Record<UserId, CardId>
	public async dealCards(config: Record<string, CardId>) {
		if (!this.gameDocRef) {
			console.error("No game started");
			return;
		}
		
		console.log("startGame", config);
		const updatePromises = Object.entries(config).map(([userId, card]) => {
			const playerRef = playersDB.getPlayerDocumentRef(this.gameDocRef!, userId);
			return playersDB.setPlayerCard(playerRef, card);
		});

		await Promise.all(updatePromises);
	}

	public resetGame = () => {
		if (!this.gameDocRef) {
			console.error("No game started");
			return;
		}
		
		const users = store.getState().host.users;
		users.forEach(user => {
			const playerRef = playersDB.getPlayerDocumentRef(this.gameDocRef!, user.userId);
			playersDB.setPlayerCard(playerRef, 'none');
		});
	}
}
