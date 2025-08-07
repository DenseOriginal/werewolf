import { CardId } from "@/services/cards";
import { CardIdOrNone } from "@/services/cards/list";
import { User } from "@/types";

export interface ViewState {
	view: 'home' | 'host' | 'player';
}

type GamePin = string | undefined;
export interface HostState {
	gamePin: GamePin;
	users: User[];
	state: 'creating' | 'settings' | 'playing';
	game: {
		cards: Partial<Record<CardId, number>>;
		userCards: Record<string, CardId>;
	}
}

export interface AuthState {
	authenticated: boolean;
}

export interface PlayerState {
	state: 'joining' | 'playing';
	gamePin: GamePin;
	card: CardIdOrNone;
}

export interface State {
	view: ViewState;
	host: HostState;
	player: PlayerState;
	auth: AuthState;
}
