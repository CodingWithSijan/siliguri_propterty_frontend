interface FormData {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
}

interface FormErrors {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
}

export const validateForm = (
	formData: FormData
): { isValid: boolean; errors: FormErrors } => {
	const errors: FormErrors = {
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
	};
	let isValid = true;

	console.log(
		`password: ${formData.password} confirm ${formData.confirmPassword}`
	);

	if (!formData.email.includes("@")) {
		errors.email = "Invalid email address.";
		isValid = false;
	}

	if (formData.password.length < 6) {
		errors.password = "Password must be at least 6 characters long.";
		isValid = false;
	}

	if (formData.password !== formData.confirmPassword) {
		errors.confirmPassword = "Passwords do not match.";
		isValid = false;
	}

	if (formData.name.trim() === "") {
		errors.name = "Name is required.";
		isValid = false;
	} else if (formData.name.length < 3) {
		errors.name = "Name must be at least 3 characters long.";
	}

	return { isValid, errors };
};
