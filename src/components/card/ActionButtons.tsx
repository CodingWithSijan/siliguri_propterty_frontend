import React, { useMemo, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { IUniversalListingType } from "../../types/listingTypes";
import { buildListingUrl } from "../../lib/buildListingUrl";
import { showSuccess, showError, showInfo } from "../../utils/toastUtils";
import BASE_URL from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { setSavedPosts } from "../../app/slices/authSlice";
import { useNavigate } from "react-router-dom";

const ActionButtons: React.FC<{ listing: IUniversalListingType }> = ({
	listing,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth,
	);
	const [isSaving, setIsSaving] = useState(false);

	const isSaved = useMemo(() => {
		if (!user?.savedPosts) return false;
		return user.savedPosts.includes(listing._id);
	}, [listing._id, user?.savedPosts]);

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

	const onToggleSave = async (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!isAuthenticated) {
			showInfo("Please sign up or login to save posts.");
			navigate("/signup");
			return;
		}

		try {
			setIsSaving(true);
			const response = await BASE_URL.patch(
				`/api/users/saved-posts/${listing._id}`,
			);
			dispatch(setSavedPosts(response.data.savedPosts ?? []));
			showSuccess(response.data.message ?? "Saved posts updated");
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unable to save this post";
			showError(errorMessage);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={onToggleSave}
				disabled={isSaving}
				className={`rounded-md p-2 transition ${
					isSaved ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-700"
				}`}
				title={isSaved ? "Remove from saved posts" : "Save this post"}
			>
				<Heart className={`h-5 w-5 ${isSaved ? "fill-red-500" : ""}`} />
			</button>
			<button
				onClick={onShare}
				className="text-sm font-medium p-2 rounded-md bg-gray-50 text-gray-700 "
			>
				<Share2 className="w-5 h-5 text-gray-500" />
			</button>
		</div>
	);
};

export default ActionButtons;
