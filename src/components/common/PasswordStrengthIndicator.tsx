// components/Auth/PasswordStrengthIndicator.tsx
import React from "react";
import { calculatePasswordStrength } from "../../utils/passwordStrength";

interface PasswordStrengthIndicatorProps {
	password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
	password,
}) => {
	const strength = calculatePasswordStrength(password);

	if (!password) return null;

	return (
		<div className="mt-2 space-y-2">
			<div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
				<div
					className={`h-full transition-all duration-300 ${strength.color}`}
					style={{ width: `${strength.percentage}%` }}
				/>
			</div>

			<div className="flex items-center justify-between text-xs">
				<span className="text-gray-600">Password Strength:</span>
				<span className={`font-semibold ${strength.textColor}`}>
					{strength.label}
				</span>
			</div>
		</div>
	);
};

export default PasswordStrengthIndicator;
