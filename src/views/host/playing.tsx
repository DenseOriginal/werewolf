import { Button } from "@/components/button"
import { useDispatch } from "@/store";
import { resetGame } from "@/store/host/thunks";

export const PlayingView = () => {
	const dispatch = useDispatch();
	
	const onReset = () => {
		dispatch(resetGame());
	}
	
	return <div className="flex flex-col h-full items-stretch">
		<span>Playing</span>

		<Button
			className="w-full mt-auto mb-9"
			onClick={onReset}
		>Reset</Button>
	</div>
}
