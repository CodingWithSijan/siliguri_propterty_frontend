import { ISODateString } from "../types/listingTypes";

function isValidDateString(date: unknown): date is ISODateString {
	return typeof date === "string" && !isNaN(Date.parse(date));
}

export const convert_ISO_Date_to_Normal = (
	date: ISODateString | undefined
): string => {
	if (isValidDateString(date)) {
		const formatted = new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		return formatted;
	} else {
		return "Invalid Date format";
	}
};
