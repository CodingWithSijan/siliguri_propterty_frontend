export interface IUser {
	id?: string;
	name: string;
	email: string;
	phoneNumber?: string;
	phone?: string;
	role?: "user" | "admin";
	authProvider?: "local" | "google";
	avatar?: string;
	createdAt: Date;
	isVerified?: boolean;
	savedPosts?: string[];
}
