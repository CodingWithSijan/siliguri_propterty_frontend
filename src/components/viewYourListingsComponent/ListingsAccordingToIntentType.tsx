import React, { useState } from "react";
import SellListingCard from "../card/SellListingCard";
import {
	IRentListingType,
	ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import RentListingCard from "../card/RentListingCard";
import PostDetailsDrawer from "./PostDetailsDrawer";

const ListingsAccordingToIntentType: React.FC<{
	listings: IUniversalListingType[] | null;
}> = ({ listings }) => {
	const [selectedPost, setSelectedPost] =
		useState<IUniversalListingType | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleCardClick = (listing: IUniversalListingType) => {
		setSelectedPost(listing);
		setDrawerOpen(true);
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
			<PostDetailsDrawer
				isUser={true}
				title="View/Edit Post"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				post={selectedPost}
			/>
		</>
	);
};

export default ListingsAccordingToIntentType;
