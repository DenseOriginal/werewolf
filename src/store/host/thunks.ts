import { viewActions } from "../reducer";
import { ThunkDispatch } from "@/store";
import { HostService } from "@/services/host";
import { hostActions } from "./reducer";
import { State } from "../types";
import { CardId } from "@/services/cards";
import { shuffleArray } from "@/stdlib/arrays";
import { Toastr } from "@/services/toastr";

export const hostGame = () => async (dispatch: ThunkDispatch) => {
	dispatch(viewActions.setView('host'));
	HostService.instance.createGame();
}

export const startGame = () => async (dispatch: ThunkDispatch, getState: () => State) => {
	const hostState = getState().host;
	const { game: { cards: settings }, users } = hostState;
	const cardArray = Object.entries(settings).flatMap(([cardId, count]) => Array(count).fill(cardId) as CardId[]);
	const shuffledCards = shuffleArray(cardArray);

	if (shuffledCards.length < users.length) {
		Toastr.error("Can't start game", "Not enough cards for all active users");
		console.error("Not enough cards for all active users");
		return;
	}

	const dealtCards = users
		.reduce((acc, user, idx) => ({
			...acc,
			[user.userId]: shuffledCards[idx % shuffledCards.length]
		}), {} as Record<string, CardId>);

	await HostService.instance.dealCards(dealtCards);
	
	dispatch(hostActions.setState('playing'));
	dispatch(hostActions.setUserCards(dealtCards));
}

export const resetGame = () => async (dispatch: ThunkDispatch) => {
	HostService.instance.resetGame();
	dispatch(hostActions.setState('settings'));
	dispatch(hostActions.setUserCards({}));
}

export const syncSettingsWithDB = () => async (_: ThunkDispatch, getState: () => State) => {
	const state = getState();
	const hostService = HostService.instance;

	hostService.updateCards(state.host.game.cards);
}
