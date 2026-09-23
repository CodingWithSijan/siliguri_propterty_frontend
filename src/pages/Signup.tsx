import React from "react";
import SignupLocalComponent from "../components/signup/SignupLocalComponent";
import { NavLink } from "react-router-dom";
import SocialAuthButtons from "../components/common/SocialAuthButtons";

const Signup: React.FC = () => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-emerald-50 via-white to-slate-100 px-4">
			<div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
				<h2 className="mb-8 text-center text-2xl font-bold text-emerald-800 sm:text-4xl">
					Create Your Account
				</h2>

				<SignupLocalComponent />
				<div className="mt-6">
					<SocialAuthButtons mode="signup" />
				</div>

				<p className="mt-6 text-center text-sm text-slate-600">
					Already have an account?{" "}
					<NavLink
						to="/login"
						className="font-medium text-emerald-700 hover:underline"
					>
						Login
					</NavLink>
				</p>
			</div>
		</div>
	);
};

export default Signup;
