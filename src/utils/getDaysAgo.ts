export function getDaysAgoFromObjectId(objectId?: string): number | null {
	if (!objectId || objectId.length < 8) return null;
	try {
		const ts = parseInt(objectId.substring(0, 8), 16) * 1000;
		const diff = Date.now() - ts;
		return Math.floor(diff / (1000 * 60 * 60 * 24));
	} catch {
		return null;
	}
}

export function getDaysAgoTextFromObjectId(objectId?: string): string {
	const days = getDaysAgoFromObjectId(objectId);
	if (days === null) return "-";

	if (days === 0) return "New today";
	if (days === 1) return "Yesterday";
	if (days < 7) return `${days} days ago`;

	if (days < 30) {
		const weeks = Math.floor(days / 7);
		return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
	}

	if (days < 365) {
		const months = Math.floor(days / 30);
		return `${months} month${months > 1 ? "s" : ""} ago`;
	}

	const years = Math.floor(days / 365);
	return `${years} year${years > 1 ? "s" : ""} ago`;
}

export default getDaysAgoTextFromObjectId;
