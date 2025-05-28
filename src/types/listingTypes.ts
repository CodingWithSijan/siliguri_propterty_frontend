export interface IBasePostType {
	_id: string;
	intent: "sell";
	title: string;
	description: string;
	location: string;
	propertyCategory: "land" | "apartment" | "house" | "room" | "shop";
	price?: string;
	user?: string;
	approvalStatus: "approved" | "pending" | "rejected";
}
export interface ISellListingType extends IBasePostType {
	pictures?: string[];
	unit?: "decimal" | "sq foot" | "katha" | "bigha" | "acre";
}

export interface IRentListingType extends IBasePostType {
	rentRole: "tenant" | "owner";
	duration?: "day" | "week" | "month" | "year";
	pictures?: string[];
}

export type IBuyPostType = IBasePostType;
