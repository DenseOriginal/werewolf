import { firebaseApp } from "@/firebase/init";
import { getAuth } from "firebase/auth";
import { DocumentReference, QueryDocumentSnapshot, collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { GAMES_REF_STRING, GameRef } from "./games";
import { firestore } from "@/firebase/firestore";
import { CardId } from "../cards";
import { CardIdOrNone } from "../cards/list";

export interface PlayerDataDB {
	name: string;
	role: CardIdOrNone;
	userId: string;
}
export type PlayerRef = DocumentReference<PlayerDataDB, PlayerDataDB>;

const playerDataConverter = {
	toFirestore: (data: PlayerDataDB) => data,
	fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as PlayerDataDB
}

export const PLAYERS_REF_STRING = "players";
const auth = getAuth(firebaseApp);

function getPlayerCollection(gameRef: GameRef) {
	const playerCollection = collection(firestore, GAMES_REF_STRING, gameRef.id, PLAYERS_REF_STRING).withConverter(playerDataConverter);
	return playerCollection;
}

function getPlayerDocumentRef(gameRef: GameRef, userId: string) {
	const playerDocument = doc(firestore, GAMES_REF_STRING, gameRef.id, PLAYERS_REF_STRING, userId).withConverter(playerDataConverter);
	return playerDocument;
}

async function createPlayerInGame(gameRef: GameRef, friendlyName: string) {
	if (!auth.currentUser) {
		throw new Error("Cant join game without user");
	}
	
	const playerDocRef = getPlayerDocumentRef(gameRef, auth.currentUser.uid);
	await setDoc(playerDocRef, {
		name: friendlyName,
		role: 'none',
		userId: auth.currentUser?.uid
	});

	return playerDocRef;
}

async function setPlayerCard(playerRef: PlayerRef, cardId: CardIdOrNone) {
	await updateDoc(playerRef, {
		role: cardId
	});
}

async function getPlayerList(gameRef: GameRef): Promise<PlayerDataDB[]> {
	const playerCollection = getPlayerCollection(gameRef);
	const snapshot = await getDocs(playerCollection);
	return snapshot.docs.map(doc => doc.data());
}

export const playersDB = {
	getPlayerCollection,
	createPlayerInGame,
	setPlayerCard,
	getPlayerList,
	getPlayerDocumentRef
}

