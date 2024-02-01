import { viewActions } from "../reducer";
import { ThunkDispatch } from "@/store";
import { HostService } from "@/services/host";

export const hostGame = () => async (dispatch: ThunkDispatch) => {
	dispatch(viewActions.setView('host'));
	HostService.instance.init();
}