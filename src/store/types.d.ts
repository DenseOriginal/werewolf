import { CardId } from "@/services/cards";
import { User } from "@/types";

export interface ViewState {
	view: 'home' | 'host' | 'player';
}

type GamePin = string;
export interface HostState {
	gamePin: GamePin;
	users: User[];
	state: 'creating' | 'settings' | 'playing';
	game: {
		cards: Partial<Record<CardId, number>>;
		userCards: Record<string, CardId>;
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
