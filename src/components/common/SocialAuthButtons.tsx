import React from "react";
import { FaGoogle } from "react-icons/fa";
import BASE_URL from "../../services";

interface SocialAuthButtonsProps {
	mode: "login" | "signup";
}

const getBackendRoot = (): string => {
	const configured = String(import.meta.env.VITE_BACKEND_URL ?? "").trim();
	if (!configured) return "";
	return configured.replace(/\/+$/, "").replace(/\/api$/, "");
};

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ mode }) => {
	const backendRoot = getBackendRoot();
	const ctaText = mode === "login" ? "Continue" : "Sign up";
	const [providers, setProviders] = React.useState<{
		google: boolean;
	}>({
		google: true,
	});

	React.useEffect(() => {
		const loadProviders = async () => {
			try {
				const response = await BASE_URL.get<{ google: boolean }>(
					"/api/auth/social/providers",
				);
				setProviders({ google: response.data.google });
			} catch {
				setProviders({ google: true });
			}
		};

		void loadProviders();
	}, []);

	const handleSocialRedirect = (provider: "google" | "facebook") => {
		if (!backendRoot) {
			return;
		}
		window.location.href = `${backendRoot}/api/auth/${provider}`;
	};

	return (
		<div className="space-y-3">
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-gray-200" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-white px-2 text-gray-500">or</span>
				</div>
			</div>

			<button
				type="button"
				onClick={() => handleSocialRedirect("google")}
				disabled={!backendRoot || !providers.google}
				className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				<FaGoogle className="text-red-500" />
				<span>{ctaText} with Google</span>
			</button>

			{!backendRoot && (
				<p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
					Social login is not configured. Set VITE_BACKEND_URL to enable it.
				</p>
			)}

			{backendRoot && !providers.google && (
				<p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
					Google login is disabled on the server. Set GOOGLE_CLIENT_ID and
					GOOGLE_CLIENT_SECRET in backend production environment variables.
				</p>
			)}
		</div>
	);
};

export default SocialAuthButtons;
