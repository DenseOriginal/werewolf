export interface GenericCard<T extends string> {
	id: T;
	name: string;
	description: string;
	score: number;
}
