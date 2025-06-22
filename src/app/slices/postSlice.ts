// 1. Redux Toolkit functions to create slices and async actions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BASE_URL from "../../services"; // Your Axios base instance (e.g., axios.create)
import { IUniversalListingType } from "../../types/listingTypes"; // Type for post

// 2. 🔄 Async thunk action: called when you submit the form
export const addNewPost = createAsyncThunk<
	IUniversalListingType,
	FormData,
	{ rejectValue: string }
>(
	"posts/addNewPost", // ✅ Action type prefix
	async (formData, { rejectWithValue }) => {
		try {
			const response = await BASE_URL.post(
				"/api/user/post/add-new-post",
				formData
			);
			return response.data.post as IUniversalListingType; // Success response
		} catch (err: any) {
			// On error, return a custom error message
			return rejectWithValue(
				err?.response?.data?.message || "Failed to add new post"
			);
		}
	}
);

// 3. 🔐 Posts slice state structure
interface PostsState {
	loading: boolean; // For loading spinner
	error: string | null; // If any error happens
}

// 4. 🌱 Initial state
const initialState: PostsState = {
	loading: false,
	error: null,
};

// 5. 🚀 Slice creation (reducers + extra async logic)
const postsSlice = createSlice({
	name: "addPost",
	initialState,
	reducers: {
		// Optional synchronous reducers (e.g., clearPosts, removePost)
	},
	extraReducers: (builder) => {
		builder
			.addCase(addNewPost.pending, (state) => {
				state.loading = true; // Start loading
				state.error = null; // Clear previous error
			})
			.addCase(addNewPost.fulfilled, (state) => {
				state.loading = false;
				state.error = null;
				// Add new post at the top
			})
			.addCase(addNewPost.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Failed to add new post";
			});
	},
});

// 6. Export reducer to be used in the store
export default postsSlice.reducer;
