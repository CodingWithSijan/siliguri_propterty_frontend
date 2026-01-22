export interface FormData {
	email: string;
	password: string;
	phone: string;
	confirmPassword: string;
	name: string;
}

export interface FormErrors {
	email: string;
	password: string;
	phone: string;
	confirmPassword: string;
	name: string;
}

export const validateForm = (
	formData: FormData,
): { isValid: boolean; errors: FormErrors } => {
	const errors: FormErrors = {
		email: "",
		password: "",
		phone: "",
		confirmPassword: "",
		name: "",
	};

	let isValid = true;

	// Email validation
	if (!formData.email.includes("@")) {
		errors.email = "Invalid email address.";
		isValid = false;
	}

	// Password validation
	if (formData.password.length < 6) {
		errors.password = "Password must be at least 6 characters long.";
		isValid = false;
	}

	if (formData.password !== formData.confirmPassword) {
		errors.confirmPassword = "Passwords do not match.";
		isValid = false;
	}

	// Name validation
	if (formData.name.trim() === "") {
		errors.name = "Name is required.";
		isValid = false;
	} else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
		errors.name = "Name must contain only alphabets.";
		isValid = false;
	} else if (formData.name.trim().length < 3) {
		errors.name = "Name must be at least 3 characters long.";
		isValid = false;
	}

	// Phone validation (expects only 10 digits as input, without +91)
	if (!/^\d{10}$/.test(formData.phone)) {
		errors.phone = "Phone number must be 10 digits.";
		isValid = false;
	}

	return { isValid, errors };
};
