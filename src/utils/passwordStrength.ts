// utils/passwordStrength.ts

export interface PasswordStrength {
	label: string;
	textColor: string;
	color: string;
	percentage: number;
}

export const calculatePasswordStrength = (
	password: string,
): PasswordStrength => {
	let score = 0;

	if (!password) {
		return { label: "", textColor: "", color: "", percentage: 0 };
	}

	// Calculate score
	if (password.length >= 8) score++;
	if (password.length >= 12) score++;
	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
	if (/\d/.test(password)) score++;
	if (/[^a-zA-Z0-9]/.test(password)) score++;

	score = Math.min(4, score);

	const levels = [
		{
			label: "Very Weak",
			textColor: "text-red-500",
			color: "bg-red-500",
			percentage: 20,
		},
		{
			label: "Weak",
			textColor: "text-orange-500",
			color: "bg-orange-500",
			percentage: 40,
		},
		{
			label: "Medium",
			textColor: "text-yellow-500",
			color: "bg-yellow-500",
			percentage: 60,
		},
		{
			label: "Strong",
			textColor: "text-blue-500",
			color: "bg-blue-500",
			percentage: 80,
		},
		{
			label: "Very Strong",
			textColor: "text-green-500",
			color: "bg-green-500",
			percentage: 100,
		},
	];

	return levels[score];
};
