import { firebaseApp } from "@/firebase/init";
import { CardId } from "@/services/cards";
import { getAuth } from "firebase/auth";
import { DocumentReference, QueryDocumentSnapshot, addDoc, collection, getDoc, getFirestore, updateDoc } from "firebase/firestore/lite";

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

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
export const gamesCollectionRef = collection(db, "games").withConverter(gameDataConverter);

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

export const gamesDB = {
	createGame,
	getGameByRef,
	updateGame
}

