export interface IUser {
	id?: string;
	name: string;
	email: string;
	phoneNumber?: string;
	phone?: string;
	role?: "user" | "admin" | "superadmin";
	authProvider?: "local" | "google" | "facebook";
	avatar?: string;
	createdAt: Date;
	isVerified?: boolean;
	savedPosts?: string[];
}
