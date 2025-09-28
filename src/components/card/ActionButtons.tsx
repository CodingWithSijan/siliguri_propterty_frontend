import React from "react";
import { Share2 } from "lucide-react";
import { ISellListingType } from "../../types/listingTypes";
import { buildListingUrl } from "../../lib/buildListingUrl";
import { showSuccess, showError, showInfo } from "../../utils/toastUtils";

const ActionButtons: React.FC<{ listing: ISellListingType }> = ({
	listing,
}) => {
	const onShare = async (e: React.MouseEvent) => {
		e.stopPropagation();
		const url = buildListingUrl(listing);

		const navWithShare = navigator as Navigator & {
			share?: (data: {
				title?: string;
				text?: string;
				url?: string;
			}) => Promise<void>;
		};

		try {
			if (navWithShare.share) {
				await navWithShare.share({
					title: listing.title,
					text: listing.title,
					url,
				});
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(url);
				showSuccess("Link copied to clipboard");
			} else {
				// Fallback when clipboard API is not available
				showInfo("Copy this link: " + url);
			}
		} catch (error) {
			// Differentiate common failures
			if ((error as DOMException)?.name === "NotAllowedError") {
				showError("Share was blocked by the browser");
			} else if ((error as Error)?.message) {
				showError((error as Error).message);
			} else {
				showError("Unable to share link");
			}
		}
	};

	return (
		<>
			<button
				onClick={onShare}
				className="text-sm font-medium p-2 rounded-md bg-gray-50 text-gray-700 "
			>
				<Share2 className="w-5 h-5 text-gray-500" />
			</button>
		</>
	);
};

export default ActionButtons;
