// src/components/Signup.tsx
import React from "react";
import Navbar from "../header_and_footer/Navbar";
import { NavLink } from "react-router-dom";
const Signup: React.FC = () => {
	return (
		<>
			<Navbar />
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4 pt-[4rem]">
				<div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
					<h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
						Create Account
					</h2>

					<form className="space-y-5">
						<input
							type="email"
							placeholder="Email"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
						<input
							type="password"
							placeholder="Password"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
						<button
							type="submit"
							className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
						>
							<NavLink to="/signup_email">Sign In with email</NavLink>
						</button>
					</form>

					<div className="flex items-center my-4">
						<div className="flex-grow h-px bg-gray-300"></div>
						<span className="px-2 text-sm text-gray-500">OR</span>
						<div className="flex-grow h-px bg-gray-300"></div>
					</div>

					<button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg hover:shadow-md transition">
						<img
							src="https://www.svgrepo.com/show/355037/google.svg"
							alt="Google"
							className="w-5 h-5"
						/>
						<span className="text-gray-700 font-medium">
							Sign Up with Google
						</span>
					</button>

					<p className="text-sm text-center mt-6 text-gray-600">
						Already have an account?{" "}
						<a href="#" className="text-blue-600 hover:underline">
							Log in
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default Signup;
