import React from "react";
import { convert_ISO_Date_to_Normal } from "../../utils/convert_ISO_Date_to_Normal";
import { Calendar } from "lucide-react";
import { IPostCreationDetails } from "../../types/postCreationDetails";

const PostCreationAndUpdateDetails: React.FC<{
	listingDateDetails: IPostCreationDetails;
}> = ({ listingDateDetails }) => {
	const { createdAt, updatedAt } = listingDateDetails || {};

	const hasAnyDate = !!createdAt || !!updatedAt;

	return (
		<fieldset className="relative border border-gray-200 rounded-xl shadow-sm bg-white">
			<legend className="px-3 text-sm font-medium text-gray-500 ml-4 -mt-2 bg-white uppercase italic">
				Post details
			</legend>
			<div className="p-4 sm:p-6">
				{!hasAnyDate ? (
					<div className="text-sm text-gray-500">
						No creation or update dates available
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{createdAt ? (
							<div className="flex items-center gap-3">
								<Calendar size={18} className="text-gray-400" />
								<div className="text-sm text-gray-700">
									<span className="block text-xs text-gray-500">
										Post created on
									</span>
									<span className="font-medium">
										{convert_ISO_Date_to_Normal(createdAt)}
									</span>
								</div>
							</div>
						) : null}

						{updatedAt ? (
							<div className="flex items-center gap-3">
								<Calendar size={18} className="text-gray-400" />
								<div className="text-sm text-gray-700">
									<span className="block text-xs text-gray-500">
										Post Last updated
									</span>
									<span className="font-medium">
										{convert_ISO_Date_to_Normal(updatedAt)}
									</span>
								</div>
							</div>
						) : null}
					</div>
				)}
			</div>
		</fieldset>
	);
};

export default PostCreationAndUpdateDetails;
