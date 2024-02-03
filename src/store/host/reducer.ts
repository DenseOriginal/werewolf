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
		addUser: (state, action: PayloadAction<string>) => {
			// If the user is already in the list, update their status
			const user = state.users.find(user => user.userId === action.payload);
			if (user) {
				user.active = true;
				return;
			}

			// Otherwise, add a new user
			state.users.push({
				userId: action.payload,
				active: true
			});
		},
		updateUserStatus: (state, action: PayloadAction<{ userId: string, active: boolean }>) => {
			const user = state.users.find(user => user.userId === action.payload.userId);
			if (user) {
				user.active = action.payload.active;
			}
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		}
	}
})

export const hostActions = hostSlice.actions;
export const hostReducer = hostSlice.reducer;
