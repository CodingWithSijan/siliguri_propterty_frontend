import React from "react";
import SignupLocalComponent from "../components/signup/SignupLocalComponent";
import { NavLink } from "react-router-dom";
import SocialAuthButtons from "../components/common/SocialAuthButtons";

const Signup: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 px-4">
			<div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10">
				<h2 className="text-2xl sm:text-4xl font-bold text-center text-blue-700 mb-8">
					Create Your Account
				</h2>

				<SignupLocalComponent />
				<div className="mt-6">
					<SocialAuthButtons mode="signup" />
				</div>

				<p className="mt-6 text-sm text-center text-gray-600">
					Already have an account?{" "}
					<NavLink
						to="/login"
						className="text-blue-600 hover:underline font-medium"
					>
						Login
					</NavLink>
				</p>
			</div>
		</div>
	);
};

export default Signup;
