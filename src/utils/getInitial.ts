export const getInitials = (name: string | undefined): string => {
	if (!name) return "";

	const words = name.trim().split(/\s+/);

	if (words.length === 0) return "";
	if (words.length === 1) return words[0][0]?.toUpperCase() || "";

	// Get first and last word only (excluding middle names)
	const firstInitial = words[0][0]?.toUpperCase() || "";
	const lastInitial = words[words.length - 1][0]?.toUpperCase() || "";

	return firstInitial + lastInitial;
};
