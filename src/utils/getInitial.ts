export const getInitials = (name: string | undefined): string => {
	return name?.[0]?.toUpperCase() || "";
};
