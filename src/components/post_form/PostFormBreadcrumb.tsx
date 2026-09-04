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
		<Breadcrumb className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
			<BreadcrumbList>
				{steps.map((label, index) => (
					<React.Fragment key={index}>
						<BreadcrumbItem className="text-black">
							<BreadcrumbLink
								className={cn(
									"text-xs capitalize sm:text-sm",
									index === currentStep
										? "font-semibold text-blue-600"
										: "text-muted-foreground",
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
