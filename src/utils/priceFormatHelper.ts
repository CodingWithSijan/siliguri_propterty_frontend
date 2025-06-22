export function formatIndianCurrency(price: number): string {
	const formattedNumber = price.toLocaleString?.("en-IN") || price.toString();

	if (price >= 10000000) {
		return `${(price / 10000000).toFixed(2)} Crore`;
	} else if (price >= 100000) {
		return `${(price / 100000).toFixed(2)} Lakh`;
	} else {
		return formattedNumber;
	}
}
