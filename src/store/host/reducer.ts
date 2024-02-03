import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GamePin, HostState } from "../types";
import { CardId } from "@/services/cards";

const initialState: HostState = {
	gamePin: '',
	users: [],
	loading: false,
	game: {
		cards: {}
	}
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
		},
		setCardCount: (state, action: PayloadAction<{ cardId: CardId, count: number }>) => {
			state.game.cards[action.payload.cardId] = Math.max(0, action.payload.count);
		},
		addCard: (state, action: PayloadAction<CardId>) => {
			state.game.cards[action.payload] = (state.game.cards[action.payload] || 0) + 1;
		},
		removeCard: (state, action: PayloadAction<CardId>) => {
			delete state.game.cards[action.payload];
		}
	}
})

export const hostActions = hostSlice.actions;
export const hostReducer = hostSlice.reducer;
