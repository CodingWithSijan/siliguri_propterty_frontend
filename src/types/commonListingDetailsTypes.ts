import { PropertyCategory } from "./postFormTypes";

export interface ICommonListingDetailsType {
	title: string;
	description: string;
	location: string;
	propertyCategory: PropertyCategory;
	intent: "sell" | "rent";
}
