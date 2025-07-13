import React from "react";
import SellListingCard from "../card/SellListingCard";
import {
	IRentListingType,
	ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import RentListingCard from "../card/RentListingCard";
import { useNavigate } from "react-router-dom";

const ListingsAccordingToIntentType: React.FC<{
	listings: IUniversalListingType[] | null;
}> = ({ listings }) => {
	const navigate = useNavigate();

	const handleCardClick = (listing: IUniversalListingType) => {
		navigate(`/dashboard/view-your-listings/edit-post/${listing._id}`);
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
										// onClick={() => handleCardClick(listing as IRentListingType)}
										userOrGlobal="user"
									/>
								);

							default:
						}
					})}
			</div>
		</>
	);
};

export default ListingsAccordingToIntentType;
