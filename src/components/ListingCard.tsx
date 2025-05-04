import React from "react";

interface ListingType {
	title: string;
	description: string;
	location: string;
	price: string;
	negotiable?: boolean;
	fixed?: boolean;
	pictures: string[];
	propertyType: string;
	createdAt: Date;
}

const ListingCard: React.FC<{ listing: ListingType; onClick: () => void }> = ({
	listing,
	onClick,
}) => {
	return (
		<div
			className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
			onClick={onClick}
		>
			<img
				src={listing.pictures[0] || "https://via.placeholder.com/300"}
				alt={listing.title}
				className="w-full h-40 object-cover"
			/>
			<div className="p-4">
				<h3 className="text-lg font-bold text-gray-800">{listing.title}</h3>
				<p className="text-sm text-gray-600 mt-2 line-clamp-2">
					{listing.description}
				</p>
			</div>
		</div>
	);
};

export default ListingCard;
