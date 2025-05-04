import React from "react";
import YourProfile from "./userContents/YourProfile";
import NewPost from "./userContents/NewPost";
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
			<h1 className=" text-4xl font-extrabold text-sky-500  text-center">
				{activeMenu}
			</h1>
			;<div className=" p-4 rounded-md">{renderContent()}</div>
		</>
	);
};

export default ContentDisplay;
