import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "./store"
import { HomeView } from "./views/home"
import { HostView } from "./views/host";
import { PlayerView } from "./views/player";
import { State } from "./store/types";
import { LoadingView } from "./views/loading";
import { useEffect } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { firebaseApp } from "./firebase/init";

const stateSelector = createSelector(
	(state: State) => state.view.view,
	(state: State) => state.auth.authenticated,
	(view, authenticated) => ({ view, authenticated })
)

function App() {
	const { view, authenticated } = useSelector(stateSelector);

	useEffect(() => {
		const auth = getAuth(firebaseApp);
		signInAnonymously(auth);
	}, [])

	return (
		<div className="bg-slate-900 noisy-bg h-full flex flex-col items-stretch gap-6 max-w-md overflow-hidden">
			{!authenticated && <LoadingView />}
			{authenticated && <>
				{view == 'home' && <HomeView />}
				{view == 'host' && <HostView />}
				{view == 'player' && <PlayerView />}
			</>}
		</div>
	)
}

export default App
