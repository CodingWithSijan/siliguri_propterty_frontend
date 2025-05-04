import React, { useState } from "react";
import { validateForm } from "../utils/formValidation";
import BASE_URL from "../services/index";
import { showError, showSuccess } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

// Type Safety
interface FormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface FormErrors {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface SignupLocalComponentProps {
	onSuccess?: () => void;
}

const SignupLocalComponent: React.FC<SignupLocalComponentProps> = () => {
	// State for form data and errors
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<FormErrors>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({ name: "", email: "", password: "", confirmPassword: "" });
		const { isValid, errors: validationErrors } = validateForm(formData);
		if (isValid) {
			try {
				await BASE_URL.post("/api/auth/register", {
					name: formData.name,
					email: formData.email,
					password: formData.password,
				});

				showSuccess("User Signup Successful.");
				navigate("/login");
				setErrors({ name: "", email: "", password: "", confirmPassword: "" });
			} catch (error: any) {
				if (error.response) {
					showError(error.response.data.message);
					console.error("Server responded with an error:", error.response.data);
				}
			}
		} else {
			setErrors(validationErrors);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	return (
		<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
			<form className="space-y-4 text-black" onSubmit={handleSubmit}>
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
						className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
						placeholder="Enter your name"
					/>
					{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
				</div>
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email Address
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
						placeholder="Enter your email"
					/>
					{errors.email && (
						<p className="text-sm text-red-500">{errors.email}</p>
					)}
				</div>
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
						className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
						placeholder="Enter your password"
					/>
					{errors.password && (
						<p className="text-sm text-red-500">{errors.password}</p>
					)}
				</div>
				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-gray-700"
					>
						Confirm Password
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						required
						className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
						placeholder="Confirm your password"
					/>
					{errors.confirmPassword && (
						<p className="text-sm text-red-500">{errors.confirmPassword}</p>
					)}
				</div>
				<button
					type="submit"
					className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Sign Up
				</button>
			</form>
		</div>
	);
};

export default SignupLocalComponent;
