import BASE_URL from ".";

export interface ConversationSummary {
	participant: {
		id: string;
		name: string;
		email: string;
		avatar?: string;
		role?: "user" | "admin" | "superadmin";
	};
	lastMessage: string;
	lastMessageAt: string;
	unreadCount: number;
}

export interface MessageItem {
	_id: string;
	fromUser:
		| string
		| {
				_id: string;
				name: string;
				role: "user" | "admin" | "superadmin";
		  };
	toUser: string;
	content: string;
	listingId?:
		| string
		| {
				_id: string;
				title: string;
				location: string;
				propertyCategory: "land" | "house" | "flat" | "shop";
				intent: "rent" | "sell" | "buy";
				pictures?: string[];
				approvalStatus: "approved" | "pending" | "rejected";
		  };
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface NotificationItem {
	_id: string;
	title: string;
	message: string;
	type:
		| "message"
		| "system"
		| "post-approved"
		| "post-rejected"
		| "post-submitted"
		| "post-updated";
	link?: string;
	isRead: boolean;
	createdAt: string;
}

export const fetchConversations = async (): Promise<ConversationSummary[]> => {
	const response = await BASE_URL.get<{ data: ConversationSummary[] }>(
		"/api/messages/conversations",
	);
	return response.data.data;
};

export const fetchConversationMessages = async (
	userId: string,
): Promise<MessageItem[]> => {
	const response = await BASE_URL.get<{ data: MessageItem[] }>(
		`/api/messages/conversation/${userId}`,
	);
	return response.data.data;
};

export const sendMessage = async (payload: {
	toUserId: string;
	content: string;
	listingId?: string;
}): Promise<void> => {
	await BASE_URL.post("/api/messages/send", payload);
};

export const fetchNotifications = async (): Promise<NotificationItem[]> => {
	const response = await BASE_URL.get<{ data: NotificationItem[] }>(
		"/api/notifications",
	);
	return response.data.data;
};

export const fetchUnreadNotificationCount = async (): Promise<number> => {
	const response = await BASE_URL.get<{ unreadCount: number }>(
		"/api/notifications/unread-count",
	);
	return response.data.unreadCount;
};

export const markNotificationRead = async (id: string): Promise<void> => {
	await BASE_URL.patch(`/api/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
	await BASE_URL.patch("/api/notifications/read-all");
};
