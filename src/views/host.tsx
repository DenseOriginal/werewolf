import { Button } from "@/components/button";
import { HostService } from "@/services/host";
import { useSelector } from "@/store"

export const HostView = () => {
	const { gamePin } = useSelector(state => ({
		gamePin: state.host.gamePin,
	}));

	return <div className="flex flex-col justify-center items-center h-full">
		<h1 className="text-xl">{gamePin}</h1>
		<Button
			className="w-full"
			onClick={() => HostService.instance.startGame()}
		>Start</Button>
	</div>
}