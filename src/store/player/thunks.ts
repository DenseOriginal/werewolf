import { viewActions } from "../reducer";
import { playerActions } from "./reducer";
import { ThunkDispatch } from "@/store";
import { PlayerService } from "@/services/player";
import { router } from "@/services/router";

export const connectToGame = (gamePin: string) => async (dispatch: ThunkDispatch) => {
	dispatch(playerActions.setGamePin(gamePin));
	PlayerService.instance.connect(gamePin);
}

export const leaveGame = () => async (dispatch: ThunkDispatch) => {
	dispatch(viewActions.setView('home'));
	dispatch(playerActions.setGamePin(undefined));
	PlayerService.instance.leaveGame();
	router.navigate('/');
}

export const onKicked = () => async (dispatch: ThunkDispatch) => {
	dispatch(viewActions.setView('home'));
	dispatch(playerActions.setGamePin(undefined));
	router.navigate('/');
}
