"use client"; // if using Next.js App Router

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SellPostForm from "../../components/user_dashboard/SellPostForm";
import RentPostForm from "../../components/user_dashboard/RentPostForm";
import BuyPostForm from "../../components/user_dashboard/BuyPostForm";
import { ArrowLeft } from "lucide-react";

export default function NewPost() {
	const [intent, setIntent] = useState("");
	// Ref to trigger form reset from parent
	const formResetRef = useRef<(() => void) | null>(null);

	// Handler to reset intent and form
	const handleGoBack = () => {
		setIntent("");
		// Call the reset function in the form
		if (formResetRef.current) formResetRef.current();
	};

	const renderForm = () => {
		const commonProps = {
			onGoBack: handleGoBack,
			registerReset: (fn: () => void) => (formResetRef.current = fn),
		};
		switch (intent) {
			case "sell":
				return <SellPostForm {...commonProps} />;
			case "rent":
				return <RentPostForm {...commonProps} />;
			case "buy":
				return <BuyPostForm {...commonProps} />;
			default:
				return null;
		}
	};

	return (
		<main className=" sm:p-6 max-w-4xl mx-auto">
			<AnimatePresence>
				{!intent && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.4 }}
						className="mb-6"
					>
						<label className="block text-lg font-medium mb-2">
							What do you want to do?
						</label>
						<select
							value={intent}
							onChange={(e) => setIntent(e.target.value)}
							className="border sm:w-full border-gray-300 rounded-md p-2"
						>
							<option value="">-- Select Intent --</option>
							<option value="sell">Sell Property</option>
							<option value="rent">Rent Property</option>
							<option value="buy">Buy Property</option>
						</select>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{intent && (
					<motion.div
						key={intent}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.4 }}
					>
						{/* Go Back Button */}
						<button
							type="button"
							onClick={handleGoBack}
							className="flex items-center gap-2 px-4 py-2 md:ml-23 mb-4 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors shadow-sm"
						>
							<ArrowLeft className="w-4 h-4" />
							Go Back
						</button>
						{renderForm()}
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
