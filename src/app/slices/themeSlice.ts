import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface ThemeState {
	mode: Theme;
}
const initialState: ThemeState = {
	mode: "dark", // default theme
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
