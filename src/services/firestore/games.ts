import { firestore } from "@/firebase/firestore";
import { firebaseApp } from "@/firebase/init";
import { CardId } from "@/services/cards";
import { getAuth } from "firebase/auth";
import { DocumentReference, QueryDocumentSnapshot, addDoc, collection, getDoc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";

export interface GameDataDB {
	pin: string;
	host: string;
	cards: Partial<Record<CardId, number>>;
}
export type GameRef = DocumentReference<GameDataDB, GameDataDB>;

const gameDataConverter = {
	toFirestore: (data: GameDataDB) => data,
	fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as GameDataDB
}

export const GAMES_REF_STRING = "games";
const auth = getAuth(firebaseApp);
export const gamesCollectionRef = collection(firestore, GAMES_REF_STRING).withConverter(gameDataConverter);

async function createGame() {
	const docRef = await addDoc(gamesCollectionRef, {
		pin: Math.floor(Math.random() * 100000).toString().padEnd(5, "0"),
		host: auth.currentUser?.uid ?? "",
		cards: {}
	});

	return docRef;
}

async function getGameByRef(ref: GameRef) {
	const doc = await getDoc(ref);
	return doc;
}

async function updateGame(ref: GameRef, update: Partial<GameDataDB>) {
	await updateDoc(ref, update);
}

async function getGameByPin(pin: string) {
	const pinQuery = query(gamesCollectionRef, where("pin", "==", pin), limit(1));
	const querySnapshot = await getDocs(pinQuery);
	const game = querySnapshot.docs[0];

	if (!game) {
		return;
	}

	return game;
}

export const gamesDB = {
	createGame,
	getGameByRef,
	updateGame,
	getGameByPin
}

