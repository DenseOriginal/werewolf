import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GamePin, HostState } from "../types";

const initialState: HostState = {
	gamePin: '',
}

const hostSlice = createSlice({
	name: 'host',
	initialState,
	reducers: {
		setGamePin: (state, action: PayloadAction<GamePin>) => {
			state.gamePin = action.payload;
		}
	}
})

export const hostActions = hostSlice.actions;
export const hostReducer = hostSlice.reducer;
