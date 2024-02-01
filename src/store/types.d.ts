import { CardId } from "@/services/cards";

export interface ViewState {
	view: 'home' | 'host' | 'player';
}

type GamePin = string;
export interface HostState {
	gamePin: GamePin;
	users: string[];
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
