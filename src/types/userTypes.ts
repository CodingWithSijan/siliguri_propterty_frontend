export interface IUser {
	name: string;
	email: string;
	phoneNumber: string;
	avatar?: string;
	createdAt: Date;
	isVerified?: boolean;
}
