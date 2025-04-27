// src/components/Signup.tsx
import React from "react";
import Navbar from "../header_and_footer/Navbar";
import SignupLocalComponent from "./SignupLocalComponent";
import google_logo from "../assets/google_logo.png";

const Signup: React.FC = () => {
	const handleGoogleSignup = () => {
		window.location.href = "http://localhost:5000/api/auth/google";
	};

	return (
		<>
			<Navbar />
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4 pt-[4rem]">
				<div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
					<h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
						Create Account
					</h2>
					<SignupLocalComponent
						onSuccess={() => console.log("Signup successful!")}
					/>
					<div className="flex items-center my-4">
						<div className="flex-grow h-px bg-gray-300"></div>
						<span className="px-2 text-sm text-gray-500">OR</span>
						<div className="flex-grow h-px bg-gray-300"></div>
					</div>
					<button
						onClick={handleGoogleSignup}
						className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg hover:shadow-md transition"
					>
						<img src={google_logo} alt="Google" className="w-5 h-5" />
						<span className="text-gray-700 font-medium">
							Sign Up with Google
						</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default Signup;
