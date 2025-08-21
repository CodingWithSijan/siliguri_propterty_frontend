import BASE_URL from ".";

interface ApiResponse<T> {
	success: boolean;
	data: T;
	message: string;
}
type Role = "user" | "admin";
type AuthProvider = "local" | "google";
interface AnalyticsResponse {
	message: string;
	result: {
		usersRes: number;
		postsRes: number;
		approvedPostsRes: number;
		pendingPostsRes: number;
		rejectedPostsRes: number;
		verifiedUsersRes: number;
		unverifiedUsersRes: number;
	};
}

export interface User {
	_id: string;
	name: string;
	email: string;
	phoneNumber?: string;
	authProvider: AuthProvider;
	role: Role;
	avatar?: string;
	createdAt: string;
	isVerified: boolean;
}

export interface Post {
	_id: string;
	title: string;
	location: string;
	propertyType: string;
	postType: "rent" | "sell";
	intent: "rent" | "sell";
	propertyCategory: "land" | "house" | "flat" | "shop";
	approvalStatus: "approved" | "rejected" | "pending";
	createdAt: string;
	updatedAt: string;

	// Legacy price field (for backward compatibility)
	price?: number;

	// Sell post specific pricing
	pricePerUnit?: number;
	totalPrice?: number;
	unit?: string;

	// Rent post specific pricing
	frequency?: "day" | "week" | "month" | "year";
	pricePerFrequency?: number;

	user?: {
		_id: string;
		name: string;
		email: string;
		phoneNumber?: string;
		avatar?: string;
		isVerified: boolean;
	};
}
export const deleteUserById = async (userId: string) => {
	try {
		const response = await BASE_URL.delete(`/api/admin/delete-user/${userId}`);

		// Axios automatically parses JSON, so response.data contains the parsed data
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else {
			throw new Error(response.data?.message || "Failed to delete user");
		}
	} catch (error) {
		console.error("Error deleting user:", error);
		throw error;
	}
};
export const fetchAllUsers = async (): Promise<User[]> => {
	const endpoint = `/api/admin/get-all-users`;
	const response = await BASE_URL.get<ApiResponse<User[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch users");
	}

	return response.data.data;
};
export const fetchUserById = async (id: string): Promise<User> => {
	const endpoint = `/api/admin/view-user/${id}`;
	const response = await BASE_URL.get<ApiResponse<User>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch users");
	}

	return response.data.data;
};

export const fetchAllPosts = async (): Promise<Post[]> => {
	const endpoint = `/api/admin/get-all-posts`;
	const response = await BASE_URL.get<ApiResponse<Post[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch posts");
	}

	return response.data.data;
};

export const fetchPostsByStatus = async (status: string): Promise<Post[]> => {
	const endpoint = `/api/admin/get-post-by-status?status=${status}`;
	const response = await BASE_URL.get<ApiResponse<Post[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch posts");
	}

	return response.data.data;
};

export const fetchUsersByVerification = async (
	isVerified: boolean
): Promise<User[]> => {
	const endpoint = `/api/admin/get-user-by-verification-status?isVerified=${isVerified}`;
	const response = await BASE_URL.get<ApiResponse<User[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch users");
	}

	return response.data.data;
};

export const fetchAnalytics = async () => {
	const endpoint = `/api/admin/count-of-documents`;
	const response = await BASE_URL.get<AnalyticsResponse>(endpoint);

	if (response.data.message !== "success") {
		throw new Error("Failed to fetch analytics");
	}

	return response.data.result;
};

export const approvePost = async (id: string) => {
	const endpoint = `/api/admin/approve-post?id=${id}`;
	const response = await BASE_URL.patch(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to approve post");
	}
	return response.data.result;
};

export const rejectPost = async (id: string) => {
	const endpoint = `/api/admin/reject-post?id=${id}`;
	const response = await BASE_URL.patch(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to approve post");
	}
	return response.data.result;
};
