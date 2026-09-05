import { MdHouse } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { showInfo } from "../../utils/toastUtils";

export const PostYourPropertyButton: React.FC = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const redirectUser = () => {
		if (isAuthenticated) {
			navigate("/dashboard/new-post");
		} else {
			navigate("/login");
			showInfo("Please login to start posting");
		}
	};
	return (
		<button
			onClick={redirectUser}
			type="button"
			className="group flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm rounded-full border border-blue-500 shadow-sm hover:shadow-lg transition-all duration-300 ease-out cursor-pointer"
		>
			<MdHouse className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
			<span>Post Your Property</span>
		</button>
	);
};
