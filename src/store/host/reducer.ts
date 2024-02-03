import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GamePin, HostState } from "../types";

const initialState: HostState = {
	gamePin: '',
	users: [],
	loading: false,
}

const hostSlice = createSlice({
	name: 'host',
	initialState,
	reducers: {
		setGamePin: (state, action: PayloadAction<GamePin>) => {
			state.gamePin = action.payload;
		},
		setUsers: (state, action: PayloadAction<string[]>) => {
			state.users = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		}
	}
})

export const hostActions = hostSlice.actions;
export const hostReducer = hostSlice.reducer;
