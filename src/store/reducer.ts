import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ViewState } from "./types";

const initialState: ViewState = {
	view: 'home'
}

const viewSlice = createSlice({
	name: 'view',
	initialState,
	reducers: {
		setView: (state, action: PayloadAction<ViewState['view']>) => {
			state.view = action.payload;
		}
	}
})

export const viewActions = viewSlice.actions;
export const viewReducer = viewSlice.reducer;
