import { viewActions } from "../reducer";
import { ThunkDispatch } from "@/store";
import { HostService } from "@/services/host";
import { hostActions } from "./reducer";
import { State } from "../types";
import { CardId } from "@/services/cards";
import { shuffleArray } from "@/stdlib/arrays";

export const hostGame = () => async (dispatch: ThunkDispatch) => {
	dispatch(viewActions.setView('host'));
	HostService.instance.init();
}

export const startGame = () => async (dispatch: ThunkDispatch, getState: () => State) => {
	const hostState = getState().host;
	const { game: { cards: settings }, users } = hostState;
	const cardArray = Object.entries(settings).flatMap(([cardId, count]) => Array(count).fill(cardId) as CardId[]);
	const shuffledCards = shuffleArray(cardArray);
	const activeUsers = users.filter(user => user.active);

	if (shuffledCards.length < activeUsers.length) {
		console.error("Not enough cards for all active users");
		return;
	}

	const dealtCards = activeUsers
		.reduce((acc, user, idx) => ({
			...acc,
			[user.userId]: shuffledCards[idx % shuffledCards.length]
		}), {} as Record<string, CardId>);

	HostService.instance.startGame(dealtCards);
	
	dispatch(hostActions.setState('playing'));
	dispatch(hostActions.setUserCards(dealtCards));
}

export const resetGame = () => async (dispatch: ThunkDispatch) => {
	HostService.instance.resetGame();
	dispatch(hostActions.setState('settings'));
	dispatch(hostActions.setUserCards({}));
}
