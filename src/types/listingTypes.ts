export interface IBaseListingType {
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
export interface ISellListingType extends IBaseListingType {
	pictures?: string[];
	unit?: "decimal" | "sq foot" | "katha" | "bigha" | "acre";
	availableLandSpace?: number;
	availableLandSpaceUnit?: "decimal" | "sq foot" | "katha" | "bigha" | "acre";
}

export interface IRentListingType extends IBaseListingType {
	rentRole: "tenant" | "owner";
	duration?: "day" | "week" | "month" | "year";
	pictures?: string[];
}

export type IBuyListingType = IBaseListingType;

export type IUniversalListingType =
	| ISellListingType
	| IBuyListingType
	| IRentListingType;
