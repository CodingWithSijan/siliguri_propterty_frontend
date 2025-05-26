"use client"; // if using Next.js App Router

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SellPostForm from "../../components/user_dashboard/SellPostForm";
import RentPostForm from "../../components/user_dashboard/RentPostForm";
import BuyPostForm from "../../components/user_dashboard/BuyPostForm";

export default function NewPost() {
	const [intent, setIntent] = useState("");

	const renderForm = () => {
		switch (intent) {
			case "sell":
				return <SellPostForm />;
			case "rent":
				return <RentPostForm />;
			case "buy":
				return <BuyPostForm />;
			default:
				return null;
		}
	};

	return (
		<main className="p-6 max-w-4xl mx-auto">
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
							className="w-full border border-gray-300 rounded-md p-2"
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
						{renderForm()}
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
