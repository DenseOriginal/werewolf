import { CardId } from ".";

export interface GenericCard<T extends string> {
	id: T;
	name: string;
	description: string;
	score: number;
	imagePath?: string;
}

export type AnyCard = GenericCard<CardId>;
