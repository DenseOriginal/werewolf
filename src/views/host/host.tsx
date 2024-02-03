import { Button } from "@/components/button";
import Spinner from "@/components/spinner";
import { useDispatch, useSelector } from "@/store"
import { Users } from "./users";
import { Settings } from "./settings";
import { startGame } from "@/store/host/thunks";

export const HostView = () => {
	const state = useSelector(state => state.host.state);

	const getView = () => {
		switch (state) {
			case 'settings': return <SettingsView />;
			case 'creating': return <LoadingView />;
			default: return <p>{":("}</p>
		}
	}

	return getView();
}

const SettingsView = () => {
	const dispatch = useDispatch();
	const gamePin = useSelector(state => state.host.gamePin);

	const onStart = () => {
		dispatch(startGame());
	}

	return (
		<div className="flex flex-col items-stretch h-full w-full overflow-y-auto p-3">
			<h1 className="text-xl text-center mb-5">Game pin: {gamePin}</h1>

			<Users />
			<Settings />

			<Button
				className="w-full mt-auto mb-9"
				onClick={onStart}
			>Start</Button>
		</div>
	)
}

const LoadingView = () => {
	return <div className="flex flex-col items-center justify-center gap-4 h-full">
		<Spinner size="xl" />
		<h1 className="text-xl">Creating room...</h1>
	</div>
}
