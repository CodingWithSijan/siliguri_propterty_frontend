import * as React from "react";
import { cn } from "../../lib/utils";
// or replace with your own className join helper

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
	current: number;
	children: React.ReactNode;
}

export function Steps({ current, children, className, ...props }: StepsProps) {
	return (
		<div className={cn("w-full", className)} {...props}>
			{/* Step Circles */}
			<div className="flex justify-between relative z-10">
				{React.Children.map(children, (child, index) => {
					if (React.isValidElement<StepProps>(child)) {
						return React.cloneElement(child, {
							index,
							current,
						} as StepProps);
					}
					return child;
				})}
			</div>

			{/* Progress bar below steps */}
			<div className="relative w-full h-1 bg-gray-300 rounded mt-4 overflow-hidden">
				<div
					className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500"
					style={{
						width: `${((current + 1) / React.Children.count(children)) * 100}%`,
					}}
				/>
			</div>
		</div>
	);
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
	index: number; // Made required to match the usage
	current: number; // Made required to match the usage
	title: string;
	status?: "complete" | "current" | "upcoming";
}

export function Step({ index = 0, current = 0, title, className }: StepProps) {
	const isActive = current === index;
	const isComplete = current > index;

	return (
		<div
			className={cn("flex-1 flex flex-col items-center text-center", className)}
		>
			<div
				className={cn(
					"w-8 h-8 rounded-full flex items-center justify-center border-2",
					isComplete
						? "bg-green-500 border-green-500 text-white"
						: isActive
						? "border-blue-500 text-blue-500"
						: "border-gray-400 text-gray-400"
				)}
			>
				{isComplete ? "✓" : index + 1}
			</div>
			<span
				className={cn(
					"text-xs mt-1",
					isActive ? "text-blue-600 font-semibold" : "text-gray-500"
				)}
			>
				{title}
			</span>
		</div>
	);
}
