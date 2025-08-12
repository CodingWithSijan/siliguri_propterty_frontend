import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail: React.FC = () => {
	const [status, setStatus] = useState("Verifying...");
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const verifyToken = async () => {
			const params = new URLSearchParams(location.search);
			const token = params.get("token");

			try {
				await axios.get(
					`${
						import.meta.env.VITE_BACKEND_URL
					}/api/auth/verify-email?token=${token}`
				);
				setStatus("✅ Email verified successfully!");
				// Fetch Latest User info and disptach in redux
				setTimeout(() => navigate("/login?verified=true"), 2000);
			} catch (err) {
				setStatus("❌ Verification failed or link expired.");
				console.log(err instanceof Error ? err : "Verification Failed");
			}
		};

		verifyToken();
	}, [location, navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="p-6 bg-white shadow-md rounded-md text-center text-lg font-semibold text-blue-700">
				{status}
			</div>
		</div>
	);
};

export default VerifyEmail;
