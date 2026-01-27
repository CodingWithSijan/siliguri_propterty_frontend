export function formatIndianCurrency(price: number): string {
	const formattedNumber = price.toLocaleString?.("en-IN") || price.toString();

	if (price >= 10000000) {
		const num = price / 10000000;
		return `${Number(num.toFixed(2))} Crore`; // Crore
	} else if (price >= 100000) {
		const num = price / 100000;
		return `${Number(num.toFixed(2))} Lakh`; // Lakh
	} else {
		return formattedNumber;
	}
}
