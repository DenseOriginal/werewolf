import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./init";

export const firestore = getFirestore(firebaseApp);