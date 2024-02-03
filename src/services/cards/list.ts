import { GenericCard } from "./types";

const werewolf: GenericCard<'werewolf'> = {
	id: 'werewolf',
	name: 'Werewolf',
	description: 'Eat a villager each night.',
	score: -6
}

const villager: GenericCard<'villager'> = {
	id: 'villager',
	name: 'Villager',
	description: 'Eat a villager each night.',
	score: 1
}


export const Cards = {
	werewolf,
	villager
}

export const getCard = (id: string) => {
	return Cards[id as keyof typeof Cards];
}

export type CardId = (typeof Cards)[keyof typeof Cards]['id'];
