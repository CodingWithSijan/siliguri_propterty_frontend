import React from "react";
import YourProfile from "./userContents/YourProfile";
interface Props {
	activeMenu: string;
}

const ContentDisplay: React.FC<Props> = ({ activeMenu }) => {
	const renderContent = () => {
		switch (activeMenu) {
			case "Your Profile":
				return <YourProfile />;
			case "New Post":
				return <div>Form for new property post goes here.</div>;
			case "View Your Listings":
				return <div>Your listed properties will be displayed here.</div>;
			case "Promote Your listings":
				return <div>Promotional tools and options will be shown here.</div>;
			case "Messages":
				return <div>User messages and inquiries will show here.</div>;
			default:
				return <div>Select a menu item to begin.</div>;
		}
	};

	return (
		<>
			<h1 className="text-black text-2xl">{activeMenu}</h1>;
			<div className="bg-white p-4 rounded-md shadow-sm">{renderContent()}</div>
		</>
	);
};

export default ContentDisplay;
