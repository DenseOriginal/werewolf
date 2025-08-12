import { CardId } from "./cards";
import { store } from "@/store";
import { hostActions } from "@/store/host/reducer";
import { Unsubscribe, onSnapshot } from "firebase/firestore";
import { Toastr } from "./toastr";
import { GameDataDB, GameRef, gamesDB } from "./firestore/games";
import { playersDB } from "./firestore/players";
import { router } from "./router";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/firebase/init";

const auth = getAuth(firebaseApp);

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

	public async createGameAndRedirect() {
		console.log("Creating game");

		store.dispatch(hostActions.setState('creating'));

		const gameRef = await gamesDB.createGame();
		const createdGame = await gamesDB.getGameByRef(gameRef);

		const gameData = createdGame.data();

		if (!gameData) {
			Toastr.error("Something bad happened", "The game couldn't be created")
			return;
		}

		router.navigate(`/${gameData.pin}/host`);
	}

	public async joinAsHost(pin: string) {
		const gameRef = await gamesDB.getGameByPin(pin);
		if (!gameRef) {
			Toastr.error("Game not found", "Please check the PIN and try again.");
			return;
		}

		this.gameDocRef = gameRef.ref;

		const gameData = gameRef.data();

		if (gameData.host != auth.currentUser?.uid) {
			Toastr.error("You are not the host of this game", "Please check the PIN and try again.");
			router.navigate('/');
			return;
		}

		store.dispatch(hostActions.setGamePin(gameData.pin));
		store.dispatch(hostActions.setState(gameData.state));
		store.dispatch(hostActions.setCards(gameData.cards || {}));
		this.setupGameListeners();
	}

	private gameListenerUnsubscribe?: Unsubscribe;
	private async setupGameListeners() {
		if (!this.gameDocRef) {
			throw new Error("Game not started yet, cant setup listeners");
		}

		this.gameListenerUnsubscribe?.();

		const playerCollectionRef = playersDB.getPlayerCollection(this.gameDocRef);
		this.gameListenerUnsubscribe = onSnapshot(playerCollectionRef, (snapshot) => {
			snapshot.docChanges().forEach(change => {
				const data = change.doc.data();
				if (change.type == 'added') {
					Toastr.info(`${data.name} has joined to room`);
					store.dispatch(hostActions.addUser({
						name: data.name.toString(),
						userId: data.userId.toString()
					}))

					if (data.role && data.role !== 'none') {
						store.dispatch(hostActions.setUserCard({
							userId: data.userId,
							cardId: data.role
						}))
					}
				}

				if (change.type == 'removed') {
					Toastr.info(`${data.name} has left the room`);
					store.dispatch(hostActions.removeUser(data.userId));
				}
			});
		});
	}

	public async kickPlayer(id: string) {
		if (!this.gameDocRef) {
			console.error("No game started");
			return;
		}
		
		const playerRef = playersDB.getPlayerDocumentRef(this.gameDocRef, id);
		await playersDB.deletePlayer(playerRef);
	}

	public async syncGameCards(cards: GameDataDB['cards']) {
		if (!this.gameDocRef) {
			console.error("No game started");
			return;
		}

		await gamesDB.updateGame(this.gameDocRef, { cards });
	}

	public async syncGameState(state: GameDataDB['state']) {
		if (!this.gameDocRef) {
			console.error("No game started");
			return;
		}

		await gamesDB.updateGame(this.gameDocRef, { state });
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
