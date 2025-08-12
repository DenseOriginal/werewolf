import { Button } from "@/components/button"
import { Section } from "@/components/section";
import { getCard } from "@/services/cards/list";
import { filterCardList } from "@/services/cards/order";
import { useDispatch, useSelector } from "@/store";
import { resetGame } from "@/store/host/thunks";
import { useCallback, useMemo } from "react";

export const PlayingView = () => {
	const dealtCards = useSelector(state => state.host.game.userCards)
	const users = useSelector(state => state.host.users);

	const getUsername = (userId: string) => users.find(user => user.userId == userId)?.name;

	const dispatch = useDispatch();
	
	const onReset = useCallback(() => {
		dispatch(resetGame());
	}, [dispatch])
	
	const order = useMemo(() => filterCardList(Object.values(dealtCards)), [dealtCards]);

	return <div className="flex flex-col h-full items-stretch">
		<h3 className="text-lg font-medium">Playing</h3>

		<div className="mt-3 flex flex-col gap-5">
			<Section title="Cards" defaultOpen>
				<ul>
					{Object.entries(dealtCards).map(entry => (
						<li key={entry[0]}>
							{getUsername(entry[0]) || 'Uknown'} - {getCard(entry[1]).name}
						</li>
					))}
				</ul>
			</Section>

			<Section title="Night order">
				<ul>
					{order.map((cardOrder, idx) => (
						<li key={cardOrder.cardId} className="flex">
							<span className="w-8 text-red-600">{idx + 1}.</span>
							{getCard(cardOrder.cardId).name}
							{cardOrder.when === 'firstNight' && ' (Only first night)'}
						</li>
					))}
				</ul>
			</Section>
		</div>

		<Button
			className="w-full mt-auto mb-9"
			onClick={onReset}
		>Reset</Button>
	</div>
}
