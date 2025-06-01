import React from "react";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
} from "../../components/ui/drawer";
import { Pencil, Trash } from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel";

interface PostDetailsDrawerProps {
	title: string | "";
	isUser: boolean;
	open: boolean;
	onClose: () => void;
	post: any; // Replace 'any' with your post type if available
}

const PostDetailsDrawer: React.FC<PostDetailsDrawerProps> = ({
	title,
	isUser,
	open,
	onClose,
	post,
}) => {
	if (!post) return null;
	const filteredPost = Object.fromEntries(
		Object.entries(post).filter(
			([key]) =>
				![
					"pictures",
					"_id",
					"createdAt",
					"updatedAt",
					"intent",
					"__v",
					"user",
				].includes(key)
		)
	);
	const handleEdit = () => {};
	return (
		<Drawer open={open} onClose={onClose} direction="right">
			<DrawerContent
				aria-describedby={undefined}
				className="w-full max-w-full h-full p-0 flex flex-col bg-background shadow-xl"
			>
				<DrawerHeader className="flex flex-row items-center justify-between px-6 py-4 border-b bg-muted/20">
					<DrawerTitle className="text-lg font-semibold truncate text-foreground">
						{title}
					</DrawerTitle>
					<div className="flex gap-2 items-center">
						{isUser && (
							<>
								<button
									onClick={() => handleEdit}
									className="p-2 rounded-full hover:bg-muted transition"
									aria-label="Edit"
								>
									<Pencil className="w-5 h-5 text-primary" />
								</button>
								<button
									onClick={() => handleEdit}
									className="p-2 rounded-full hover:bg-red-100 transition"
									aria-label="Delete"
								>
									<Trash className="w-5 h-5 text-red-600" />
								</button>
							</>
						)}
						<DrawerClose asChild>
							<button
								className="ml-2 p-2 rounded-full hover:bg-muted transition"
								aria-label="Close"
							>
								✕
							</button>
						</DrawerClose>
					</div>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
					{/* Image Carousel */}
					<div className="relative">
						<Carousel>
							<CarouselContent>
								{post.pictures.map((item: string, index: number) => (
									<CarouselItem key={index}>
										<img
											src={item}
											alt={`Post image ${index + 1}`}
											className="max-h-72 w-full object-contain rounded-lg"
										/>
									</CarouselItem>
								))}
							</CarouselContent>

							{/* Navigation */}
							{/* Carousel Navigation */}
							<CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 z-20 bg-white/90 rounded-full shadow-lg p-2 hover:bg-gray-200 transition" />
							<CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 z-20 bg-white/90 rounded-full shadow-lg p-2 hover:bg-gray-200 transition" />
						</Carousel>
					</div>

					{/* Post Info */}
					<div className="space-y-3 text-sm text-muted-foreground">
						{Object.entries(filteredPost).map(([key, value]) => (
							<p key={key}>
								<span className="font-semibold text-foreground capitalize">
									{key}:
								</span>{" "}
								{String(value)}
							</p>
						))}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default PostDetailsDrawer;
