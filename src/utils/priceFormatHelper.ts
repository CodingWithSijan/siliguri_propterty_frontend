export function formatIndianCurrency(price: number): string {
	if (price >= 10000000) {
		const num = price / 10000000;
		const formatted = num.toLocaleString("en-IN", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		});
		return `${formatted} Crore`; // Crore
	} else if (price >= 100000) {
		const num = price / 100000;
		const formatted = num.toLocaleString("en-IN", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		});
		return `${formatted} Lakh`; // Lakh
	} else {
		return price.toLocaleString("en-IN");
	}
}
