import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";

type IconType = "info" | "checkCircle";

interface AlertMessageProps {
	title: string;
	description: string;
	iconType: IconType;
}
export const AlertMessage = ({
	title,
	description,
	iconType = "info",
}: AlertMessageProps) => {
	return (
		<Alert className="max-w-md">
			{iconType === "info" ? <InfoIcon /> : <CheckCircle2Icon />}
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
};
