import { Card } from "@/components/card";
import Spinner from "@/components/spinner";
import { classNames } from "@/stdlib/layout";
import { useDispatch, useSelector } from "@/store"
import { leaveGame } from "@/store/player/thunks";
import { useCallback } from "react";

export const PlayerView = () => {
	const dispatch = useDispatch();
	const playerState = useSelector(state => state.player.state);
	const gamePin = useSelector(state => state.player.gamePin);
	const card = useSelector(state => state.player.card);

	const leaveGameHandler = useCallback(() => {
		dispatch(leaveGame());
	}, [dispatch])

	return playerState == 'playing' ? (
		<div className="flex flex-col justify-center items-center h-full p-3">
			<div className={classNames('absolute top-0 left-4 flex gap-2')}>
				<span
					className={classNames(
						'bg-yellow-100 noisy',
						'border-amber-500 border-2 border-t-0 text-gray-950 text-lg text-center rounded-b px-3',
					)}
				>{gamePin}</span>

				<button
					className={classNames(
						'bg-yellow-100 active:bg-yellow-200 noisy',
						'border-amber-500 border-2 border-t-0 text-gray-950 text-lg text-center rounded-b px-1.5',
					)}
					onClick={leaveGameHandler}
				><i className="fa-solid fa-xmark"></i>
				</button>
			</div>

			<div className="w-[300px] h-[415px] relative">
				<Placeholder hide={card != 'none'} />
				{card != 'none' && <Card card={card} />}
			</div>
			{card != 'none' && <p className="text-xl mt-4">Click to reveal</p>}
			{card == 'none' && <p className="text-xl mt-4">Waiting for your card</p>}
		</div>
	) : <LoadingView />
}

const Placeholder = (props: { hide: boolean }) => (
	<div className={classNames(
		'absolute inset-0 flex justify-center items-center rounded-3xl',
		'border-dashed border-white border-1 border-4',
		'transition-all duration-500',
		props.hide && 'opacity-0',
	)}>
	</div>
)

const LoadingView = () => {
	return <div className="flex flex-col items-center justify-center gap-4 h-full">
		<Spinner size="xl" />
		<h1 className="text-xl">Joining room...</h1>
	</div>
}
