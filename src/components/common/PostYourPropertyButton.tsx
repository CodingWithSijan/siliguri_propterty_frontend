import { MdHouse } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { showInfo } from "../../utils/toastUtils";

export const PostYourPropertyButton: React.FC = (): React.ReactNode => {
	const navigate = useNavigate();
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth,
	);
	const redirectUser = () => {
		if (isAuthenticated) {
			if (user?.role === "admin") {
				navigate("/admin/home");
				showInfo("Use user account to post properties");
				return;
			}
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
			className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-gray-700 hover:text-gray-900 font-medium text-sm rounded-sm border-1 border-blue-200 hover:border-blue-400 shadow-sm  transition-all duration-300 ease-out overflow-hidden cursor-pointer"
		>
			{/* Icon with subtle animation */}
			<MdHouse className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />

			{/* Text */}
			<span className="relative z-10">Post Your Property</span>
		</button>
	);
};
