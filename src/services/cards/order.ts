import { CardId } from ".";

interface CardOrder {
	cardId: CardId;
	when: 'firstNight' | 'everyNight';
}

const every = (cardId: CardId): CardOrder => ({ cardId, when: 'everyNight' });
const firstNight = (cardId: CardId): CardOrder => ({ cardId, when: 'firstNight' });

const orderList: CardOrder[] = [
	firstNight('cupid'),
	every('werewolf'),
	every('privateInvestigator'),
	every('seer'),
	every('spellcaster'),
	every('witch'),
]

export const filterCardList = (cards: CardId[]): CardOrder[] => {
	return orderList.filter(order => cards.includes(order.cardId));
}