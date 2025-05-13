// types/postTypes.ts

export type IntentType = "buy" | "sell" | "rent" | string;

export type PropertyCategory =
	| "land"
	| "apartment"
	| "house"
	| "room"
	| "shop"
	| string;

export type PriceType = "fixed" | "negotiable" | string;

export type UnitType =
	| "per decimal"
	| "per katha"
	| "per bigha"
	| "per acre"
	| "per sq foot"
	| string;

export type RentDuration = "day" | "week" | "month" | "year" | string;

export interface BaseFormData {
	intent: IntentType;
	title: string;
	description: string;
	location: string;
	propertyCategory: PropertyCategory;
	pictures: File[];
}

export interface SellFormData extends BaseFormData {
	intent: "sell";
	price: string;
	priceType: PriceType;
	propertyCategory: "land" | "apartment" | "house" | "room" | "shop";
	unit?: string; // Required only when propertyCategory === 'land'
}

export interface BuyFormData extends BaseFormData {
	intent: "buy";
	budget?: string;
	priceType: PriceType;
}

export interface RentFormData extends BaseFormData {
	intent: "rent";
	rentRole: "tenant" | "owner";
	budget: string; // Make budget required
	duration: RentDuration; // Make duration required
}

export type FormDataTypes = SellFormData | BuyFormData | RentFormData;
