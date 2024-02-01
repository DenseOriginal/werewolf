import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PlayerState } from "../types";

const initialState: PlayerState = {
	loading: false,
	gamePin: '',
	card: 'unknown'
}

const playeSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setGamePin: (state, action: PayloadAction<PlayerState['gamePin']>) => {
			state.gamePin = action.payload;
		},
		setCard: (state, action: PayloadAction<PlayerState['card']>) => {
			state.card = action.payload;
		},
	},
	
})

export const playerActions = playeSlice.actions;
export const playerReducer = playeSlice.reducer;
