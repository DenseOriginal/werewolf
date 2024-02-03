import { CardId } from "@/services/cards";
import { User } from "@/types";

export interface ViewState {
	view: 'home' | 'host' | 'player';
}

type GamePin = string;
export interface HostState {
	gamePin: GamePin;
	users: User[];
	loading: boolean;
	game: {
		cards: Partial<Record<CardId, number>>;
	}
}

export interface PlayerState {
	loading: boolean;
	gamePin: GamePin;
	card: 'unknown' | CardId;
}

export interface State {
	view: ViewState;
	host: HostState;
	player: PlayerState;
}
