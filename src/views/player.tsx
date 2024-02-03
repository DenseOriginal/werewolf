import { Card } from "@/components/card";
import { classNames } from "@/stdlib/layout";
import { useSelector } from "@/store"

export const PlayerView = () => {
	const { gamePin, card } = useSelector(state => ({
		gamePin: state.player.gamePin,
		card: state.player.card,
	}));

	return <div className="flex flex-col justify-center items-center h-full">
		<span
			className={classNames(
				'bg-yellow-200 noisy',
				'border-amber-500 border-2 border-t-0 text-gray-950 text-lg text-center rounded-b px-3',
				'absolute top-0 left-4',
			)}
		>{gamePin}</span>
		<div className="w-[300px] h-[415px] relative">
			<Placeholder hide={card != 'unknown'} />
			{card != 'unknown' && <Card card={card} /> }
		</div>
		{card != 'unknown' && <p className="text-xl mt-4">Click to reveal</p> }
		{card == 'unknown' && <p className="text-xl mt-4">Waiting for your card</p> }
	</div>
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
