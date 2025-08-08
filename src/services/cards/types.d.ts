import { CardId } from ".";

export interface GenericCard<T extends string> {
	id: T;
	name: string;
	description: string;
	score: number;
	hasImage?: boolean;
}

export type AnyCard = GenericCard<CardId>;
