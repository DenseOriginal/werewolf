import { GenericCard } from "./types";
import werewolfImgUrl from "@/assets/faces/werewolf.webp";
import villagerImgUrl from "@/assets/faces/villager.webp";
import seerImgUrl from "@/assets/faces/seer.webp";
import witchImgUrl from "@/assets/faces/witch.webp";
import cupidImgUrl from "@/assets/faces/cupid.webp";
import hunterImgUrl from "@/assets/faces/hunter.webp";

const werewolf: GenericCard<'werewolf'> = {
	id: 'werewolf',
	name: 'Werewolf',
	description: 'Eat a villager each night.',
	score: -6,
	imagePath: werewolfImgUrl,
}

const villager: GenericCard<'villager'> = {
	id: 'villager',
	name: 'Villager',
	description: 'Find the werewolves and lynch them.',
	score: 1,
	imagePath: villagerImgUrl,
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
	score: 7,
	imagePath: seerImgUrl,
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
	score: 4,
	imagePath: witchImgUrl,
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
	score: -3,
	imagePath: cupidImgUrl,
}

const hunter: GenericCard<'hunter'> = {
	id: 'hunter',
	name: 'Hunter',
	description: 'If you are killed, take someone down with you.',
	score: -3,
	imagePath: hunterImgUrl,
}

const wildcard1: GenericCard<'wildcard1'> = {
	id: 'wildcard1',
	name: 'Wildcard 1',
	description: 'Wildcard 1',
	score: 0
}

const wildcard2: GenericCard<'wildcard2'> = {
	id: 'wildcard2',
	name: 'Wildcard 2',
	description: 'Wildcard 2',
	score: 0
}

const wildcard3: GenericCard<'wildcard3'> = {
	id: 'wildcard3',
	name: 'Wildcard 3',
	description: 'Wildcard 3',
	score: 0
}

const wildcard4: GenericCard<'wildcard4'> = {
	id: 'wildcard4',
	name: 'Wildcard 4',
	description: 'Wildcard 4',
	score: 0
}

const wildcard5: GenericCard<'wildcard5'> = {
	id: 'wildcard5',
	name: 'Wildcard 5',
	description: 'Wildcard 5',
	score: 0
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
	hunter,
	wildcard1,
	wildcard2,
	wildcard3,
	wildcard4,
	wildcard5,
}

export const getCard = (id: string) => {
	return Cards[id as keyof typeof Cards];
}

export type CardId = (typeof Cards)[keyof typeof Cards]['id'];
export type CardIdOrNone = CardId | 'none';
