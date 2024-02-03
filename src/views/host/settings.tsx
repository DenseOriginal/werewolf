import { Hr } from "@/components/hr"
import { Select } from "@/components/select";
import { CardId, Cards } from "@/services/cards";
import { getCard } from "@/services/cards/list";
import { AnyCard } from "@/services/cards/types";
import { classNames } from "@/stdlib/layout";
import { useDispatch, useSelector } from "@/store"
import { hostActions } from "@/store/host/reducer";
import { useMemo } from "react";

export const Settings = () => {
	const dispatch = useDispatch();

	const selectedCards = useSelector(state => state.host.game.cards);
	const options: AnyCard[] = useMemo(
		() => Object.values(Cards)
			.filter(card => !selectedCards[card.id]),
		[selectedCards]
	)

	const onSelect = (card: AnyCard) => {
		dispatch(hostActions.addCard(card.id));
	}

	return <div>
		<Hr leftAligned><p className="text-lg">Settings</p></Hr>
		<Select
			options={options}
			getOptionLabel={card => card.name}
			getOptionValue={card => card.id}
			onSelect={onSelect}
			value={''}
			placeholder="Add card..."
			className="mt-3"
		/>

		<div className="flex flex-col gap-2 my-3">
			{Object.keys(selectedCards).map(card => <CardOption key={card} cardId={card as CardId} />)}
		</div>

		<Warnings />
	</div>
}

const commonButtonClasses = "bg-yellow-100 active:bg-yellow-200 text-black px-2 noisy";
const CardOption = ({ cardId }: { cardId: CardId }) => {
	const dispatch = useDispatch();
	const settings = useSelector(state => state.host.game.cards[cardId] || 0);
	const card = getCard(cardId);

	const onRemove = () => {
		dispatch(hostActions.removeCard(cardId));
	}

	const increase = () => {
		dispatch(hostActions.setCardCount({ cardId, count: settings + 1 }));
	}

	const decrease = () => {
		dispatch(hostActions.setCardCount({ cardId, count: settings - 1 }));
	}

	return <div className="flex gap-2 items-center justify-between">
		<span>{card.name} - {settings || 0}</span>

		<div className="border-amber-400 border-2 noisy rounded">
			<button className={classNames(commonButtonClasses, "rounded-l-sm")} onClick={increase}><i className="fa-solid fa-plus"></i></button>
			<button className={classNames(commonButtonClasses)} onClick={decrease}><i className="fa-solid fa-minus"></i></button>
			<button className={classNames(commonButtonClasses, "rounded-r-sm")} onClick={onRemove}>Remove</button>
		</div>
	</div>
}

const Warnings = () => {
	const totalCards = useSelector(state => Object.values(state.host.game.cards).reduce((acc, count) => acc + count, 0));
	const totalPlayers = useSelector(state => state.host.users.length);

	const hasTooManyCards = totalCards > totalPlayers;

	return <div>
		{hasTooManyCards && <p className="text-amber-400"><i className="fa-solid fa-triangle-exclamation"></i> Too many cards for the number of players!</p>}
	</div>
}
