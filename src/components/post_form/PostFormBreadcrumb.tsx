// Breadcrumb component for the post form steps.
// Shows the user's progress through the multi-step post creation process.
// Used in PostStepperForm.

// components/PostForm/PostFormBreadcrumb.tsx

import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";

import { cn } from "../../lib/utils";

const steps = [
	"Select category",
	"Add details",
	"upload pictures",
	"Review post",
];

interface PostFormBreadcrumbProps {
	currentStep: number;
}

const PostFormBreadcrumb: React.FC<PostFormBreadcrumbProps> = ({
	currentStep,
}) => {
	return (
		<Breadcrumb className="bg-gray-100 p-2 rounded-sm mb-8">
			<BreadcrumbList>
				{steps.map((label, index) => (
					<React.Fragment key={index}>
						<BreadcrumbItem className="text-black">
							<BreadcrumbLink
								className={cn(
									"text-sm capitalize",
									index === currentStep
										? "text-blue-600 font-semibold"
										: "text-muted-foreground"
								)}
							>
								{label}
							</BreadcrumbLink>
						</BreadcrumbItem>

						{/* ✅ Move separator outside the <BreadcrumbItem> */}
						{index < steps.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default PostFormBreadcrumb;
