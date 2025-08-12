import React, { useState } from "react";
import SellListingCard from "../card/SellListingCard";
import {
	IRentListingType,
	ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import RentListingCard from "../card/RentListingCard";
import { useNavigate } from "react-router-dom";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import BASE_URL from "../../services";
import { showSuccess, showError } from "../../utils/toastUtils";

const ListingsAccordingToIntentType: React.FC<{
	listings: IUniversalListingType[] | null;
	onRefresh?: () => Promise<void>;
}> = ({ listings, onRefresh }) => {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedListing, setSelectedListing] =
		useState<IUniversalListingType | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleCardClick = (listing: IUniversalListingType) => {
		setSelectedListing(listing);
		setIsModalOpen(true);
	};

	const handleEdit = () => {
		if (selectedListing) {
			navigate(
				`/dashboard/view-your-listings/edit-post/${selectedListing._id}`
			);
			setIsModalOpen(false);
		}
	};

	const handleDelete = async () => {
		if (!selectedListing) return;

		try {
			setIsDeleting(true);
			await BASE_URL.delete(`/api/user/post/delete/${selectedListing._id}`);
			showSuccess("Listing deleted successfully");
			setIsModalOpen(false);
			// Refresh the listings using the callback
			if (onRefresh) {
				await onRefresh();
			}
		} catch {
			showError("Failed to delete listing");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl gap-4">
				{listings &&
					listings.map((listing) => {
						switch (listing?.intent?.toLowerCase()) {
							case "sell":
								return (
									<SellListingCard
										key={listing._id as string}
										listing={listing as ISellListingType}
										onClick={() => handleCardClick(listing as ISellListingType)}
										userOrGlobal="user"
									/>
								);
							case "rent":
								return (
									<RentListingCard
										key={listing._id as string}
										listing={listing as IRentListingType}
										onClick={() => handleCardClick(listing as IRentListingType)}
										userOrGlobal="user"
									/>
								);

							default:
						}
					})}
			</div>

			{/* Action Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="w-[95vw] max-w-md mx-auto rounded-xl shadow-2xl border-0 p-0 overflow-hidden">
					<DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
						<DialogTitle className="text-xl font-semibold">
							Manage Listing
						</DialogTitle>
						<DialogDescription className="text-blue-100 mt-2">
							{selectedListing?.title}
						</DialogDescription>
					</DialogHeader>

					<div className="p-6 space-y-4">
						{/* Status Badge */}
						<div className="flex items-center gap-2 mb-4">
							<span className="text-sm text-gray-600">Status:</span>
							<span
								className={`px-3 py-1 rounded-full text-xs font-medium ${
									selectedListing?.approvalStatus === "approved"
										? "bg-green-100 text-green-800"
										: selectedListing?.approvalStatus === "pending"
										? "bg-yellow-100 text-yellow-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{selectedListing?.approvalStatus?.toUpperCase()}
							</span>
						</div>

						{/* Edit Button */}
						<button
							onClick={handleEdit}
							disabled={selectedListing?.approvalStatus === "approved"}
							className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl font-semibold text-white transition-all ${
								selectedListing?.approvalStatus === "approved"
									? "bg-gray-400 cursor-not-allowed"
									: "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
							}`}
						>
							<FaEdit className="w-5 h-5" />
							{selectedListing?.approvalStatus === "approved"
								? "Cannot Edit (Approved)"
								: "Edit Listing"}
						</button>

						{/* Edit Info */}
						{selectedListing?.approvalStatus === "approved" && (
							<div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
								<FaExclamationTriangle className="text-amber-600 w-4 h-4 mt-0.5 flex-shrink-0" />
								<p className="text-amber-800 text-sm">
									Approved listings cannot be edited. Contact support if changes
									are needed.
								</p>
							</div>
						)}

						{/* Delete Button */}
						<button
							onClick={handleDelete}
							disabled={isDeleting}
							className="w-full flex items-center justify-center gap-3 p-4 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							<FaTrash className="w-5 h-5" />
							{isDeleting ? "Deleting..." : "Delete Listing"}
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ListingsAccordingToIntentType;
