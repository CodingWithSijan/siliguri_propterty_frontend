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
			className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-100 hover:shadow"
		>
			<MdHouse className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
			<span>Post Your Property</span>
		</button>
	);
};
