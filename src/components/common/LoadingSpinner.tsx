interface LoadingSpinnerProps {
	color?: string;
	message?: string;
}

const LoadingSpinner = ({
	color = "blue",
	message = "Loading...",
}: LoadingSpinnerProps) => (
	<div className="flex flex-col items-center justify-center py-12">
		<div
			className={`w-10 h-10 border-4 border-${color} border-t-transparent rounded-full animate-spin mb-4`}
		/>
		<p className="text-lg text-gray-500">{message}</p>
	</div>
);

export default LoadingSpinner;
