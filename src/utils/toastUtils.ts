import { Bounce, toast } from "react-toastify";

const showError = (msg: string): void => {
	toast.error(msg, {
		position: "top-center",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: false,
		pauseOnHover: false,
		draggable: false,
		progress: undefined,
		theme: "colored",
		transition: Bounce,
	});
};

const showSuccess = (msg: string): void => {
	toast.success(msg, {
		position: "top-center",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: false,
		pauseOnHover: false,
		draggable: false,
		progress: undefined,
		theme: "colored",
		transition: Bounce,
	});
};

export { showSuccess, showError };
