import React, { useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { login } from "../app/slices/authSlice";
import BASE_URL from "../services";
import { showError } from "../utils/toastUtils";

const SocialAuthCallback: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const finalizeSocialLogin = async () => {
			const token = searchParams.get("token");
			if (!token) {
				showError("Social login failed. Missing token.");
				navigate("/login", { replace: true });
				return;
			}

			try {
				const response = await BASE_URL.get("/api/auth/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const user = response.data?.user;
				if (!user) {
					throw new Error("User payload missing in auth response");
				}

				dispatch(login({ user, token }));

				navigate(
					user.role === "admin" || user.role === "superadmin"
						? "/admin/home"
						: "/dashboard/your-profile",
					{
						replace: true,
					},
				);
			} catch (error) {
				console.error("Social auth callback failed:", error);
				showError("Unable to complete social login. Please try again.");
				navigate("/login", { replace: true });
			}
		};

		void finalizeSocialLogin();
	}, [dispatch, navigate, searchParams]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4">
			<div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
				<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
					<BiLoaderAlt className="text-2xl text-blue-600 animate-spin" />
				</div>
				<h1 className="text-xl font-semibold text-gray-900 mb-2">
					Signing you in
				</h1>
				<p className="text-sm text-gray-600">
					Please wait while we complete your social authentication.
				</p>
			</div>
		</div>
	);
};

export default SocialAuthCallback;
