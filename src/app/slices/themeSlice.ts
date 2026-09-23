import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface ThemeState {
	mode: Theme;
}

const getInitialTheme = (): Theme => {
	if (typeof window === "undefined") {
		return "light";
	}

	const savedTheme = window.localStorage.getItem("theme-mode");
	if (savedTheme === "dark" || savedTheme === "light") {
		return savedTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
};

const initialState: ThemeState = {
	mode: getInitialTheme(),
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		toggleTheme: (state) => {
			state.mode = state.mode === "dark" ? "light" : "dark";
		},
		setTheme: (state, action: PayloadAction<Theme>) => {
			state.mode = action.payload;
		},
	},
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
