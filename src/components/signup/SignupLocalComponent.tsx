import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../services";
import { showError, showSuccess } from "../../utils/toastUtils";
import { validateForm, FormData, FormErrors } from "../../utils/formValidation";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";
import PasswordStrengthIndicator from "../common/PasswordStrengthIndicator";
import { EyeOff, Eye } from "lucide-react";
const SignupLocalComponent: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState<FormErrors>({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { isValid, errors: validationErrors } = validateForm(formData);

		if (!isValid) {
			setErrors(validationErrors);
			return;
		}

		try {
			setIsLoading(true);
			await BASE_URL.post("/api/auth/register", {
				name: formData.name,
				email: formData.email.toLowerCase(),
				phone: "+91" + formData.phone,
				password: formData.password,
			});

			showSuccess("User Signup Successful.");
			navigate("/login");
		} catch (error: unknown) {
			const apiMessage =
				typeof error === "object" &&
				error !== null &&
				"response" in error &&
				// @ts-expect-error runtime guard
				error.response?.data?.message
					? // @ts-expect-error runtime guard
						error.response.data.message
					: null;
			showError(apiMessage || "Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5 text-black">
			{/* Name */}
			<div>
				<label
					htmlFor="name"
					className="flex items-center gap-2 text-sm font-medium text-gray-700"
				>
					<FaUser /> Name
				</label>
				<input
					type="text"
					name="name"
					id="name"
					value={formData.name}
					onChange={handleChange}
					required
					disabled={isLoading}
					className="w-full px-4 py-2 mt-1 text-sm border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					placeholder="Your full name"
				/>
				{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
			</div>

			{/* Email */}
			<div>
				<label
					htmlFor="email"
					className="flex items-center gap-2 text-sm font-medium text-gray-700"
				>
					<FaEnvelope /> Email Address
				</label>
				<input
					type="email"
					name="email"
					id="email"
					value={formData.email}
					onChange={handleChange}
					required
					disabled={isLoading}
					className="w-full px-4 py-2 mt-1 text-sm border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					placeholder="you@example.com"
				/>
				{errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
			</div>

			{/* Phone */}
			<div>
				<label
					htmlFor="phone"
					className="flex items-center gap-2 text-sm font-medium text-gray-700"
				>
					<FaPhoneAlt /> Phone Number
				</label>
				<div className="flex items-center mt-1">
					<span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-gray-700 text-sm">
						+91
					</span>
					<input
						type="text"
						name="phone"
						id="phone"
						maxLength={10}
						value={formData.phone}
						onChange={handleChange}
						required
						disabled={isLoading}
						className="w-full px-4 py-2 text-sm border rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="10-digit number"
					/>
				</div>
				{errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
			</div>

			{/* Password */}
			<div>
				<div className="relative mt-1">
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						id="password"
						value={formData.password}
						onChange={handleChange}
						required
						disabled={isLoading}
						className="w-full px-4 py-2 pr-10 text-sm border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="Minimum 6 characters"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-400 focus:outline-none disabled:opacity-50"
						disabled={isLoading}
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? (
							<EyeOff className="w-4 h-4" />
						) : (
							<Eye className="w-4 h-4" />
						)}
					</button>
				</div>
				<PasswordStrengthIndicator password={formData.password} />
				{errors.password && (
					<p className="text-sm text-red-500">{errors.password}</p>
				)}
			</div>

			{/* Confirm Password */}
			<div>
				<label
					htmlFor="confirmPassword"
					className="flex items-center gap-2 text-sm font-medium text-gray-700"
				>
					<FaLock /> Confirm Password
				</label>
				<div className="relative mt-1">
					<input
						type={showConfirmPassword ? "text" : "password"}
						name="confirmPassword"
						id="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						required
						disabled={isLoading}
						className="w-full px-4 py-2 pr-10 text-sm border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="Re-enter password"
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-400 focus:outline-none disabled:opacity-50"
						disabled={isLoading}
						aria-label={showConfirmPassword ? "Hide password" : "Show password"}
					>
						{showConfirmPassword ? (
							<EyeOff className="w-4 h-4" />
						) : (
							<Eye className="w-4 h-4" />
						)}
					</button>
				</div>
				{errors.confirmPassword && (
					<p className="text-sm text-red-500">{errors.confirmPassword}</p>
				)}
			</div>

			{/* Submit */}
			<button
				type="submit"
				disabled={isLoading}
				className="relative w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
			>
				{isLoading && (
					<span
						className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"
						aria-hidden="true"
					/>
				)}
				{isLoading ? "Registering..." : "Create Account"}
			</button>
		</form>
	);
};

export default SignupLocalComponent;
