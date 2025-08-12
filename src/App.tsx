import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "./store"
import { State } from "./store/types";
import { LoadingView } from "./views/loading";
import { useEffect } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { firebaseApp } from "./firebase/init";
import {
	RouterProvider,
} from "react-router";
import { router } from "./services/router";

const stateSelector = createSelector(
	(state: State) => state.auth.authenticated,
	(authenticated) => ({ authenticated })
)

function App() {
	const { authenticated } = useSelector(stateSelector);

	useEffect(() => {
		const auth = getAuth(firebaseApp);
		signInAnonymously(auth);
	}, [])

	return (
		<div className="bg-slate-900 noisy-bg h-full flex flex-col items-stretch gap-6 max-w-md overflow-hidden">
			{!authenticated && <LoadingView />}
			{authenticated && <RouterProvider router={router} />}
		</div>
	)
}

export default App
