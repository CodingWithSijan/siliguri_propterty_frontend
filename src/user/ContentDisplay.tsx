import React from "react";
import YourProfile from "./userContents/YourProfile";
import NewPost from "./userContents/NewPost";
import ViewYourListings from "./userContents/ViewYourListings";

interface Props {
	activeMenu: string;
}

const ContentDisplay: React.FC<Props> = ({ activeMenu }) => {
	const renderContent = () => {
		switch (activeMenu) {
			case "Your Profile":
				return <YourProfile />;
			case "New Post":
				return <NewPost />;
			case "View Your Listings":
				return <ViewYourListings />;
			case "Promote Your listings":
				return (
					<div className="text-gray-600">
						Promotional tools and options will be shown here.
					</div>
				);
			case "Messages":
				return (
					<div className="text-gray-600">
						User messages and inquiries will show here.
					</div>
				);
			default:
				return (
					<div className="text-gray-500 italic">
						Select a menu item to begin.
					</div>
				);
		}
	};

	return <div className="w-full">{renderContent()}</div>;
};

export default ContentDisplay;
