import React, { useEffect, useState } from "react";

const YourProfile: React.FC = () => {
	// useEffect(() => {}, []);
	// const [profilePicture, setProfilePicture] = useState<string | undefined>(
	// 	user?.profilePicture
	// );

	// const handleProfilePictureChange = (
	// 	event: React.ChangeEvent<HTMLInputElement>
	// ) => {
	// 	if (event.target.files && event.target.files[0]) {
	// 		const file = event.target.files[0];
	// 		const reader = new FileReader();

	// 		reader.onload = () => {
	// 			if (reader.result) {
	// 				setProfilePicture(reader.result as string);
	// 				// Update user profile picture in context
	// 				setUser((prevUser) => ({
	// 					...prevUser!,
	// 					profilePicture: reader.result as string,
	// 				}));
	// 			}
	// 		};

	// 		reader.readAsDataURL(file);
	// 	}
	// };

	return (
		<div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
			Your Profile
		</div>
	);
};

export default YourProfile;
