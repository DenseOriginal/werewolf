import { firebaseApp } from "@/firebase/init";
import { getAuth } from "firebase/auth";
import { DocumentReference, QueryDocumentSnapshot, addDoc, collection, getDoc, getDocs, getFirestore, limit, query, updateDoc, where } from "firebase/firestore/lite";
import { GAMES_REF_STRING, GameRef } from "./games";

export interface PlayerDataDB {
	name: string;
	role: string;
	userId: string;
}
export type PlayerRef = DocumentReference<PlayerDataDB, PlayerDataDB>;

const playerDataConverter = {
	toFirestore: (data: PlayerDataDB) => data,
	fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as PlayerDataDB
}

export const PLAYERS_REF_STRING = "players";
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function getPlayerCollection(gameRef: GameRef) {
	const playerCollection = collection(db, GAMES_REF_STRING, gameRef.id, PLAYERS_REF_STRING).withConverter(playerDataConverter);
	return playerCollection;
}

async function createPlayerInGame(gameRef: GameRef, friendlyName: string) {
	if (!auth.currentUser) {
		throw new Error("Cant join game without user");
	}
	
	const playerCollection = getPlayerCollection(gameRef);
	const playerDoc = await addDoc(playerCollection, {
		name: friendlyName,
		role: "",
		userId: auth.currentUser?.uid
	});

	return playerDoc;
}

export const playersDB = {
	getPlayerCollection,
	createPlayerInGame
}

