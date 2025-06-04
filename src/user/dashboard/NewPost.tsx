import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SellPostForm from "../../components/user_dashboard/SellPostForm";
import RentPostForm from "../../components/user_dashboard/RentPostForm";
import BuyPostForm from "../../components/user_dashboard/BuyPostForm";
import { ArrowLeft } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";
import { Home, Key, ShoppingBag } from "lucide-react";

export default function NewPost() {
	const [intent, setIntent] = useState("");
	const [dialogOpen, setDialogOpen] = useState(true); // open dialog by default
	const formResetRef = useRef<(() => void) | null>(null);

	const handleGoBack = () => {
		setIntent("");
		setDialogOpen(true);
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
		<main className="sm:p-6 max-w-4xl mx-auto">
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-md w-full rounded-2xl shadow-xl p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-gray-200">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
							Post Your Property
						</DialogTitle>
						<DialogDescription asChild>
							<div>
								<p className="text-gray-600 mb-6 text-base">
									Choose what you want to do. Select an intent to get started.
								</p>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									{/* Sell Card */}
									<button
										type="button"
										onClick={() => {
											setIntent("sell");
											setDialogOpen(false);
										}}
										className={`group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500
                ${
									intent === "sell"
										? "border-primary-500 bg-primary-50"
										: "border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50"
								}`}
										aria-label="Sell Property"
									>
										<Home className="w-8 h-8 mb-2 text-primary-500 group-hover:scale-110 transition-transform" />
										<span className="font-semibold text-lg text-primary-700">
											Sell
										</span>
										<span className="text-xs text-gray-500 mt-1">
											List your property for sale
										</span>
									</button>
									{/* Rent Card */}
									<button
										type="button"
										onClick={() => {
											setIntent("rent");
											setDialogOpen(false);
										}}
										className={`group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
									intent === "rent"
										? "border-blue-500 bg-blue-50"
										: "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50"
								}`}
										aria-label="Rent Property"
									>
										<Key className="w-8 h-8 mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
										<span className="font-semibold text-lg text-blue-700">
											Rent
										</span>
										<span className="text-xs text-gray-500 mt-1">
											Offer your property for rent
										</span>
									</button>
									{/* Buy Card */}
									<button
										type="button"
										onClick={() => {
											setIntent("buy");
											setDialogOpen(false);
										}}
										className={`group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500
                ${
									intent === "buy"
										? "border-green-500 bg-green-50"
										: "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50"
								}`}
										aria-label="Buy Property"
									>
										<ShoppingBag className="w-8 h-8 mb-2 text-green-500 group-hover:scale-110 transition-transform" />
										<span className="font-semibold text-lg text-green-700">
											Buy
										</span>
										<span className="text-xs text-gray-500 mt-1">
											Find your dream property
										</span>
									</button>
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<AnimatePresence>
				{intent && !dialogOpen && (
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
