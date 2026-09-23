import BASE_URL from ".";

interface ApiResponse<T> {
	success: boolean;
	data: T;
	message: string;
}

type Role = "user" | "admin" | "superadmin";
type AuthProvider = "local" | "google" | "facebook";

export type PhoneFilterOption = "all" | "withPhone" | "withoutPhone";

interface UserManagementFilters {
	query?: string;
	phoneFilter?: PhoneFilterOption;
}

interface PostModerationFilters {
	query?: string;
	phoneFilter?: PhoneFilterOption;
	intent?: "buy" | "sell" | "rent";
	category?: "land" | "house" | "flat" | "shop";
	minPrice?: number;
	maxPrice?: number;
	location?: string;
}

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

export interface CreateUserBySuperAdminPayload {
	name: string;
	email: string;
	phoneNumber?: string;
	password?: string;
	verificationMethod: "link" | "otp";
}

export interface CreateUserBySuperAdminResponse {
	user: User;
	temporaryPassword: string;
	verificationMethod: "link" | "otp";
	otpCode: string | null;
	onboardingEmailSent: boolean;
	onboardingEmailError: string | null;
}

export interface Post {
	_id: string;
	title: string;
	location: string;
	propertyType?: string;
	postType?: "rent" | "sell";
	intent: "rent" | "sell";
	propertyCategory: "land" | "house" | "flat" | "shop";
	approvalStatus: "approved" | "rejected" | "pending";
	createdAt: string;
	updatedAt: string;
	price?: number | string;
	pricePerUnit?: number;
	totalPrice?: number;
	unit?: string;
	frequency?: "day" | "week" | "month" | "year";
	pricePerFrequency?: number | string;
	user?: {
		_id: string;
		name: string;
		email: string;
		phoneNumber?: string;
		avatar?: string;
		isVerified: boolean;
	};
}

const buildUserQuery = (filters?: UserManagementFilters): string => {
	const params = new URLSearchParams();
	if (filters?.query?.trim()) {
		params.set("q", filters.query.trim());
	}
	if (filters?.phoneFilter && filters.phoneFilter !== "all") {
		params.set("phone", filters.phoneFilter);
	}

	const queryString = params.toString();
	return queryString ? `?${queryString}` : "";
};

const buildPostQuery = (filters?: PostModerationFilters): string => {
	const params = new URLSearchParams();
	if (filters?.query?.trim()) {
		params.set("q", filters.query.trim());
	}
	if (filters?.phoneFilter && filters.phoneFilter !== "all") {
		params.set("phone", filters.phoneFilter);
	}
	if (filters?.intent) {
		params.set("intent", filters.intent);
	}
	if (filters?.category) {
		params.set("category", filters.category);
	}
	if (
		typeof filters?.minPrice === "number" &&
		Number.isFinite(filters.minPrice)
	) {
		params.set("minPrice", String(filters.minPrice));
	}
	if (
		typeof filters?.maxPrice === "number" &&
		Number.isFinite(filters.maxPrice)
	) {
		params.set("maxPrice", String(filters.maxPrice));
	}
	if (filters?.location?.trim()) {
		params.set("location", filters.location.trim());
	}

	const queryString = params.toString();
	return queryString ? `?${queryString}` : "";
};

export const deleteUserById = async (userId: string) => {
	try {
		const response = await BASE_URL.delete(`/api/admin/delete-user/${userId}`);

		if (response.status >= 200 && response.status < 300) {
			return response.data;
		}

		throw new Error(response.data?.message || "Failed to delete user");
	} catch (error) {
		console.error("Error deleting user:", error);
		throw error;
	}
};

export const updateUserRole = async (
	userId: string,
	role: Role,
): Promise<User> => {
	const endpoint = `/api/admin/users/${userId}/role`;
	const response = await BASE_URL.patch<ApiResponse<User>>(endpoint, { role });

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to update user role");
	}

	return response.data.data;
};

export const resetUserPasswordByAdmin = async (
	userId: string,
	newPassword: string,
): Promise<string> => {
	const endpoint = `/api/admin/users/${userId}/reset-password`;
	const response = await BASE_URL.patch<ApiResponse<null>>(endpoint, {
		newPassword,
	});

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to reset password");
	}

	return response.data.message;
};

export const fetchAllUsers = async (): Promise<User[]> => {
	const endpoint = `/api/admin/get-all-users`;
	const response = await BASE_URL.get<ApiResponse<User[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch users");
	}

	return response.data.data;
};

export const fetchUsersForManagement = async (
	filters?: UserManagementFilters,
): Promise<User[]> => {
	const endpoint = `/api/admin/get-all-users${buildUserQuery(filters)}`;
	const response = await BASE_URL.get<ApiResponse<User[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch users");
	}

	return response.data.data;
};

export const fetchUsersByVerification = async (
	isVerified: boolean,
	filters?: UserManagementFilters,
): Promise<User[]> => {
	const params = new URLSearchParams({ isVerified: String(isVerified) });
	if (filters?.query?.trim()) {
		params.set("q", filters.query.trim());
	}
	if (filters?.phoneFilter && filters.phoneFilter !== "all") {
		params.set("phone", filters.phoneFilter);
	}

	const endpoint = `/api/admin/get-user-by-verification-status?${params.toString()}`;
	const response = await BASE_URL.get<ApiResponse<User[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch users");
	}

	return response.data.data;
};

export const fetchAdminUsers = async (query = ""): Promise<User[]> => {
	const endpoint = `/api/admin/admin-users${
		query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""
	}`;
	const response = await BASE_URL.get<ApiResponse<User[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch admin users");
	}

	return response.data.data;
};

export const searchUsersForSuperAdmin = async (query = ""): Promise<User[]> => {
	const endpoint = `/api/admin/users/search${
		query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""
	}`;
	const response = await BASE_URL.get<ApiResponse<User[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to search users");
	}

	return response.data.data;
};

export const promoteAdminByEmail = async (email: string): Promise<User> => {
	const endpoint = `/api/admin/promote-admin-by-email`;
	const response = await BASE_URL.post<ApiResponse<User>>(endpoint, { email });

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to promote admin");
	}

	return response.data.data;
};

export const createUserBySuperAdmin = async (
	payload: CreateUserBySuperAdminPayload,
): Promise<CreateUserBySuperAdminResponse> => {
	const endpoint = `/api/admin/users/create`;
	const response = await BASE_URL.post<
		ApiResponse<CreateUserBySuperAdminResponse>
	>(endpoint, payload);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to create user");
	}

	return response.data.data;
};

export const resendVerificationLinkByAdmin = async (
	userId: string,
): Promise<string> => {
	const endpoint = `/api/admin/users/${userId}/send-verification-link`;
	const response = await BASE_URL.patch<ApiResponse<null>>(endpoint);

	if (!response.data.success) {
		throw new Error(
			response.data.message || "Failed to send verification link",
		);
	}

	return response.data.message;
};

export const fetchUserById = async (id: string): Promise<User> => {
	const endpoint = `/api/admin/view-user/${id}`;
	const response = await BASE_URL.get<ApiResponse<User>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch users");
	}

	return response.data.data;
};

export const fetchAllPosts = async (
	filters?: PostModerationFilters,
): Promise<Post[]> => {
	const endpoint = `/api/admin/get-all-posts${buildPostQuery(filters)}`;
	const response = await BASE_URL.get<ApiResponse<Post[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch posts");
	}

	return response.data.data;
};

export const fetchPostsByStatus = async (
	status: string,
	filters?: PostModerationFilters,
): Promise<Post[]> => {
	const params = new URLSearchParams({ status });
	if (filters?.query?.trim()) {
		params.set("q", filters.query.trim());
	}
	if (filters?.phoneFilter && filters.phoneFilter !== "all") {
		params.set("phone", filters.phoneFilter);
	}
	if (filters?.intent) {
		params.set("intent", filters.intent);
	}
	if (filters?.category) {
		params.set("category", filters.category);
	}
	if (
		typeof filters?.minPrice === "number" &&
		Number.isFinite(filters.minPrice)
	) {
		params.set("minPrice", String(filters.minPrice));
	}
	if (
		typeof filters?.maxPrice === "number" &&
		Number.isFinite(filters.maxPrice)
	) {
		params.set("maxPrice", String(filters.maxPrice));
	}
	if (filters?.location?.trim()) {
		params.set("location", filters.location.trim());
	}

	const endpoint = `/api/admin/get-post-by-status?${params.toString()}`;
	const response = await BASE_URL.get<ApiResponse<Post[]>>(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to fetch posts");
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

export const deletePost = async (id: string) => {
	const endpoint = `/api/admin/delete-post/${id}`;
	const response = await BASE_URL.delete(endpoint);

	if (!response.data.success) {
		throw new Error(response.data.message || "Failed to delete post");
	}
	return response.data.result;
};
