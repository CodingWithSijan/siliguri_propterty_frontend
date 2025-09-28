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
	if (days === 0) return "Today";
	return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default getDaysAgoTextFromObjectId;
