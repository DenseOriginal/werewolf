import { Button } from "@/components/button"
import { Hr } from "@/components/hr";
import { useDispatch, useSelector } from "@/store";
import { resetGame } from "@/store/host/thunks";

export const PlayingView = () => {
	const dealtCards = useSelector(state => state.host.game.userCards)
	const users = useSelector(state => state.host.users);

	const getUsername = (userId: string) => users.find(user => user.userId == userId)?.name;

	const dispatch = useDispatch();
	
	const onReset = () => {
		dispatch(resetGame());
	}
	
	return <div className="flex flex-col h-full items-stretch">
		<span>Playing</span>

		<div className="mt-3">
			<Hr leftAligned><p className="text-lg">Cards</p></Hr>
			<ul>
				{Object.entries(dealtCards).map(entry => (
					<li>
						{getUsername(entry[0]) || 'Uknown'} - {entry[1]}
					</li>
				))}
			</ul>
		</div>

		<Button
			className="w-full mt-auto mb-9"
			onClick={onReset}
		>Reset</Button>
	</div>
}
