import { GamePin } from "../types";
import { viewActions } from "../reducer";
import { playerActions } from "./reducer";
import { ThunkDispatch } from "@/store";
import { PlayerService } from "@/services/player";

export const connectToGame = (gamePin: GamePin) => async (dispatch: ThunkDispatch) => {
	dispatch(viewActions.setView('player'));
	dispatch(playerActions.setGamePin(gamePin));
	PlayerService.instance.connect(gamePin);
}