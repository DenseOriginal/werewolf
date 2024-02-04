import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GamePin, HostState } from "../types";
import { CardId } from "@/services/cards";
import { User } from "@/types";

const initialState: HostState = {
	gamePin: '',
	users: [],
	state: 'creating',
	game: {
		cards: {},
		userCards: {}
	}
}

const hostSlice = createSlice({
	name: 'host',
	initialState,
	reducers: {
		setGamePin: (state, action: PayloadAction<GamePin>) => {
			state.gamePin = action.payload;
		},
		addUser: (state, action: PayloadAction<Omit<User, 'active'>>) => {
			// If the user is already in the list, update their status
			const user = state.users.find(user => user.userId === action.payload.userId);
			if (user) {
				user.active = true;
				user.name = action.payload.name;
				return;
			}

			// Otherwise, add a new user
			state.users.push({
				userId: action.payload.userId,
				name: action.payload.name,
				active: true
			});
		},
		updateUserStatus: (state, action: PayloadAction<{ userId: string, active: boolean }>) => {
			const user = state.users.find(user => user.userId === action.payload.userId);
			if (user) {
				user.active = action.payload.active;
			}
		},
		setState: (state, action: PayloadAction<HostState['state']>) => {
			state.state = action.payload;
		},
		setCardCount: (state, action: PayloadAction<{ cardId: CardId, count: number }>) => {
			state.game.cards[action.payload.cardId] = Math.max(0, action.payload.count);
		},
		addCard: (state, action: PayloadAction<CardId>) => {
			state.game.cards[action.payload] = (state.game.cards[action.payload] || 0) + 1;
		},
		removeCard: (state, action: PayloadAction<CardId>) => {
			delete state.game.cards[action.payload];
		},
		setUserCards: (state, action: PayloadAction<HostState['game']['userCards']>) => {
			state.game.userCards = action.payload;
		}
	}
})

export const hostActions = hostSlice.actions;
export const hostReducer = hostSlice.reducer;
