import { getAuth, onAuthStateChanged } from "firebase/auth";
import { store } from "@/store";
import { authActions } from "@/store/auth/reducer";
import { firebaseApp } from "@/firebase/init";

const auth = getAuth(firebaseApp);
onAuthStateChanged(auth, (user) => {
	// Set the auth state based on wether the user signed in or not.
	store.dispatch(authActions.setAuthenticated(!!user));
});
