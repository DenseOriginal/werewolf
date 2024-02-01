import { useSelector } from "./store"
import { HomeView } from "./views/home"
import { HostView } from "./views/host";
import { PlayerView } from "./views/player";

function App() {
	const view = useSelector(state => state.view.view);

	return (
		<div className="bg-slate-900 noisy-bg h-full flex flex-col items-center gap-6 max-w-md p-3 overflow-hidden">
			{view == 'home' && <HomeView />}
			{view == 'host' && <HostView />}
			{view == 'player' && <PlayerView />}
		</div>
	)
}

export default App
