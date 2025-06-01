import React, { useState } from "react";
import SellListingCard from "../card/SellListingCard";
import {
	IBuyListingType,
	IRentListingType,
	ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import RentListingCard from "../card/RentListingCard";
import BuyListingCard from "../card/BuyListingCard";

const ListingsAccordingToIntentType: React.FC<{
	listings: IUniversalListingType[] | Partial<IUniversalListingType>[] | null;
}> = ({ listings }) => {
	const [selectedPost, setSelectedPost] =
		useState<IUniversalListingType | null>(null);
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl gap-4">
			{listings &&
				listings.map((listing) => {
					switch (listing?.intent?.toLowerCase()) {
						case "sell":
							return (
								<SellListingCard
									key={listing._id as string}
									listing={listing as ISellListingType}
									onClick={() => setSelectedPost(listing as ISellListingType)}
									userOrGlobal="user"
								/>
							);
						case "rent":
							return (
								<RentListingCard
									key={listing._id as string}
									listing={listing as IRentListingType}
									onClick={() => setSelectedPost(listing as IRentListingType)}
									userOrGlobal="user"
								/>
							);
						case "buy":
							return (
								<BuyListingCard
									key={listing._id}
									listing={listing as IBuyListingType}
									onClick={() => setSelectedPost(listing as IBuyListingType)}
									userOrGlobal="user"
								/>
							);
						default:
					}
				})}
		</div>
	);
};

export default ListingsAccordingToIntentType;
