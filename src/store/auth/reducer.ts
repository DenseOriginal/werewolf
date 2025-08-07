import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../types";
import "./firebase_listener";

const initialState: AuthState = {
	authenticated: false,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthenticated: (state, action: PayloadAction<boolean>) => {
			state.authenticated = action.payload;
		}
	}
})

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authInitialState = initialState;
