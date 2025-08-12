import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postSlice";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
export const store = configureStore({
	reducer: {
		addPost: postsReducer,
		auth: authReducer,
		theme: themeReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
