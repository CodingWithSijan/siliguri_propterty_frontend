export const capitalize_first_letter_text = (
	text: string | undefined,
): string => {
	if (!text) return "";
	return text.charAt(0).toUpperCase() + text.slice(1);
};
