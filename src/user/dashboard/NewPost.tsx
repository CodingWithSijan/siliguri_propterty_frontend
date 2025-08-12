import { useState } from "react";
import { Home, Key } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";
import { useNavigate } from "react-router-dom";
export default function NewPost() {
	const navigate = useNavigate();

	const [dialogOpen, setDialogOpen] = useState(true);

	const handleDialogOpenChange = (open: boolean) => {
		setDialogOpen(open);
	};

	return (
		<main className="sm:p-6 max-w-4xl mx-auto">
			<Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
				<DialogContent
					showClose={false}
					className={`max-w-md w-full rounded-2xl shadow-xl p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-gray-200 
					}`}
				>
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
							Post Your Property
						</DialogTitle>
						<DialogDescription asChild>
							<div>
								<p className="text-gray-600 mb-6 text-base">
									Choose what you want to do. Select an intent to get started.
								</p>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<button
										type="button"
										onClick={() => {
											navigate("/dashboard/new-post/sell");
											setDialogOpen(false);
										}}
										className={`group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 
										}`}
										aria-label="Sell Property"
									>
										<Home className="w-8 h-8 mb-2 text-primary-500 group-hover:scale-110 transition-transform" />
										<span className="font-semibold text-lg text-primary-700">
											Sell
										</span>
										<span className="text-xs text-gray-500 mt-1">
											List your property for sale
										</span>
									</button>
									<button
										type="button"
										onClick={() => {
											navigate("/dashboard/new-post/rent");
											setDialogOpen(false);
										}}
										className={`group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 
										}`}
										aria-label="Rent Property"
									>
										<Key className="w-8 h-8 mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
										<span className="font-semibold text-lg text-blue-700">
											Rent
										</span>
										<span className="text-xs text-gray-500 mt-1">
											Offer your property for rent
										</span>
									</button>
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
}
