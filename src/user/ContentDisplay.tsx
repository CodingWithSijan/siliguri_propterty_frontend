import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import YourProfile from "./dashboard/YourProfile";
import NewPost from "./dashboard/NewPost";
import ViewYourListings from "./dashboard/ViewYourListings";

interface Props {
	activeMenu: string;
}

const ContentDisplay: React.FC<Props> = ({ activeMenu }) => {
	const renderContent = () => {
		switch (activeMenu) {
			case "Your Profile":
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="h-full overflow-y-auto px-6 py-4"
					>
						<YourProfile />
					</motion.div>
				);
			case "New Post":
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="h-full overflow-y-auto px-6 py-4"
					>
						{/* <NewPost /> */}
						<NewPost />
					</motion.div>
				);
			case "View Your Listings":
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="h-full overflow-y-auto px-6 py-4"
					>
						<ViewYourListings />
					</motion.div>
				);
			case "Promote Your listings":
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="flex items-center justify-center h-full"
					>
						<div className="text-gray-600 bg-gray-50 rounded-xl p-8 shadow-sm">
							<h3 className="text-xl font-semibold mb-3">Coming Soon</h3>
							<p className="text-gray-500">
								Promotional tools and options will be available here.
							</p>
						</div>
					</motion.div>
				);
			case "Messages":
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="flex items-center justify-center h-full"
					>
						<div className="text-gray-600 bg-gray-50 rounded-xl p-8 shadow-sm">
							<h3 className="text-xl font-semibold mb-3">Coming Soon</h3>
							<p className="text-gray-500">
								Your messages and inquiries will appear here.
							</p>
						</div>
					</motion.div>
				);
			default:
				return (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex items-center justify-center h-full"
					>
						<div className="text-gray-500 italic">
							Select a menu item to begin
						</div>
					</motion.div>
				);
		}
	};

	return (
		<div className="w-full h-full ">
			<AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
		</div>
	);
};

export default ContentDisplay;
