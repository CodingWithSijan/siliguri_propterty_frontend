// redux/slices/postEditorSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	BuyPostFormInputs,
	RentPostFormInputs,
	SellPostFormInputs,
} from "../../types/postFormTypes";

type PostIntent = "buy" | "rent" | "sell";

type PostFormInputs =
	| BuyPostFormInputs
	| RentPostFormInputs
	| SellPostFormInputs;

interface PostEditorState {
	postIntent: PostIntent;
	postType: PostFormInputs | null;

	title: string | null;
	description: string | null;
	location: string | null;
	propertyCategory: string | null;
	price?: number | null;
}

type intentData = BuyPostFormInputs | RentPostFormInputs | SellPostFormInputs;

const initialState: PostEditorState = {
	postIntent: "buy",
	postType: null,
	title: null,
	description: null,
	location: null,
	propertyCategory: null,
	price: null,
};

const postEditorSlice = createSlice({
	name: "postEditor",
	initialState,
	reducers: {
		setPostTitle(state, action: PayloadAction<{ value: string }>) {
			state.title = action.payload.value;
		},

		setPostIntent(state, action: PayloadAction<PostIntent>) {
			state.postIntent = action.payload;
			state.postType = null; // reset form when intent changes
		},
		setPostType(state, action: PayloadAction<PostFormInputs>) {
			state.postType = action.payload;
		},
		updatePostField(
			state,
			action: PayloadAction<{ field: keyof PostFormInputs; value: any }>
		) {
			if (state.postType) {
				state.postType = {
					...state.postType,
					[action.payload.field]: action.payload.value,
				};
			}
		},
		clearPostEditor(state) {
			state.postIntent = "buy";
			state.postType = null;
		},
	},
});

export const {
	setPostIntent,
	setPostType,
	updatePostField,
	clearPostEditor,
	setPostTitle,
} = postEditorSlice.actions;

export default postEditorSlice.reducer;
