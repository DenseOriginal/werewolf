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
	description: 'Find the werewolves and lynch them.',
	score: 1
}

const privateInvestigator: GenericCard<'privateInvestigator'> = {
	id: 'privateInvestigator',
	name: 'P.I.',
	description: 'Inspect three players each night (they must be beside each other). You only know if at least one of them is malicious',
	score: 3
}

const seer: GenericCard<'seer'> = {
	id: 'seer',
	name: 'Seer',
	description: 'Inspect a player each night.',
	score: 7
}

const spellcaster: GenericCard<'spellcaster'> = {
	id: 'spellcaster',
	name: 'Spellcaster',
	description: 'At night, indicate a player who must not use their voice the following day.',
	score: 1
}

const witch: GenericCard<'witch'> = {
	id: 'witch',
	name: 'Witch',
	description: 'Kill or heal a player, once each per game.',
	score: 4
}

const prince: GenericCard<'prince'> = {
	id: 'prince',
	name: 'Prince',
	description: 'You can\'t be lynched',
	score: 3
}

const tanner: GenericCard<'tanner'> = {
	id: 'tanner',
	name: 'Tanner',
	description: 'You only win if you are lynched.',
	score: 1
}

const cupid: GenericCard<'cupid'> = {
	id: 'cupid',
	name: 'Cupid',
	description: 'Choose two players to be lovers. If one of those players dies, the other dies from a broken heart.',
	score: -3
}

export const Cards = {
	werewolf,
	villager,
	privateInvestigator,
	seer,
	spellcaster,
	witch,
	prince,
	tanner,
	cupid,
}

export const getCard = (id: string) => {
	return Cards[id as keyof typeof Cards];
}

export type CardId = (typeof Cards)[keyof typeof Cards]['id'];
