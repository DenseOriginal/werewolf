export type Id = number;

export interface PeerMessage<Type extends string, Data extends object> {
	type: Type;
	data: Data;
}

export interface Message {
	
}
