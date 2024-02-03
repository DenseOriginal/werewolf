import { Button } from "@/components/button";
import Spinner from "@/components/spinner";
import { HostService } from "@/services/host";
import { useSelector } from "@/store"
import { Users } from "./users";
import { Settings } from "./settings";

export const HostView = () => {
	const loading = useSelector(state => state.host.loading);
	const gamePin = useSelector(state => state.host.gamePin);

	return !loading ? (
		<div className="flex flex-col items-stretch h-full w-full overflow-y-auto p-3">
			<h1 className="text-xl text-center mb-5">Game pin: {gamePin}</h1>

			<Users />
			<Settings />

			<Button
				className="w-full mt-auto mb-9"
				onClick={() => HostService.instance.startGame()}
			>Start</Button>
		</div>
	) : <LoadingView />
}

const LoadingView = () => {
	return <div className="flex flex-col items-center justify-center gap-4 h-full">
		<Spinner size="xl" />
		<h1 className="text-xl">Creating room...</h1>
	</div>
}
