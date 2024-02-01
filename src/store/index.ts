import { Action, configureStore } from "@reduxjs/toolkit";
import { hostReducer } from "./host/reducer";
import { playerReducer } from "./player/reducer";
import { viewReducer } from "./reducer";
import { useSelector as reduxSelector, useDispatch as reduxDispatch } from "react-redux";
import { ThunkDispatch as ReduxThunk } from "redux-thunk";
import { State } from "./types";

export const store = configureStore<State>({
	reducer: {
		host: hostReducer,
		player: playerReducer,
		view: viewReducer
	},
})

export type AppDispatch = typeof store.dispatch
export type ThunkDispatch = ReduxThunk<State, unknown, Action>;

export const useSelector = reduxSelector.withTypes<State>();
export const useDispatch = reduxDispatch.withTypes<AppDispatch>();
