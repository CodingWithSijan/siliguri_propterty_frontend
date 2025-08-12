import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";

const ImageModal: React.FC = () => {
	return (
		<Dialog>
			<DialogTrigger>Open</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure</DialogTitle>
					<DialogDescription>
						Lorem ipsum dolor sit amet consectetur, adipisicing elit.
						Dignissimos repellat soluta esse explicabo quidem mollitia omnis
						maxime consequatur inventore repudiandae? Hic velit placeat ex ipsum
						perspiciatis ea nam tempore laborum?
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default ImageModal;
