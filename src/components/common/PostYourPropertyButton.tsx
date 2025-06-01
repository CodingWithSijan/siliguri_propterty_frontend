import { MdHouse } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contextAPI/UserAuthContext";

export const PostYourPropertyButton: React.FC = (): React.ReactNode => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const redirectUser = () => {
		const navigatePath = isAuthenticated ? "/dashboard" : "/login";
		navigate(navigatePath);
	};
	return (
		<button
			onClick={redirectUser}
			type="button"
			className="text-gray-600 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-bold rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2 mb-2 cursor-pointer"
		>
			<MdHouse className="h-5 w-5 mr-2" />
			Post You Property now
		</button>
	);
};
