import React from "react";
import useFetch from "../../hooks/useFetch";
import { fetchAnalytics } from "../../services/fetchFunctionsForAdmin";
import {
	Users,
	FileText,
	CheckCircle2,
	Clock,
	XCircle,
	UserCheck,
	UserX,
} from "lucide-react";

const HomeTab: React.FC = () => {
	const { data, loading, error } = useFetch(() => fetchAnalytics());

	if (loading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error?.message}</div>;
	if (!data) return null;

	// Card data array for easy mapping and ordering
	const cards = [
		{
			color: "blue",
			title: "Total Users",
			value: data.usersRes ?? 0,
			icon: <Users size={32} className="mb-2" />,
		},
		{
			color: "green",
			title: "Verified Users",
			value: data.verifiedUsersRes ?? 0,
			icon: <UserCheck size={32} className="mb-2" />,
		},
		{
			color: "yellow",
			title: "Unverified Users",
			value: data.unverifiedUsersRes ?? 0,
			icon: <UserX size={32} className="mb-2" />,
		},
		{
			color: "purple",
			title: "Total Posts",
			value: data.postsRes ?? 0,
			icon: <FileText size={32} className="mb-2" />,
		},
		{
			color: "green",
			title: "Active Posts",
			value: data.approvedPostsRes ?? 0,
			icon: <CheckCircle2 size={32} className="mb-2" />,
		},
		{
			color: "orange",
			title: "Pending Posts",
			value: data.pendingPostsRes ?? 0,
			icon: <Clock size={32} className="mb-2" />,
		},
		{
			color: "red",
			title: "Rejected Posts",
			value: data.rejectedPostsRes ?? 0,
			icon: <XCircle size={32} className="mb-2" />,
		},
	];

	return (
		<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
			{cards.map((card, idx) => (
				<Card
					key={idx}
					color={card.color}
					title={card.title}
					value={card.value}
					icon={card.icon}
				/>
			))}
		</div>
	);
};

interface CardProps {
	color: string;
	title: string;
	value: number;
	icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ color, title, value, icon }) => (
	<div
		className={`bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl border border-gray-200 dark:border-gray-700`}
		tabIndex={0}
		role="button"
		aria-label={title}
		style={{ minHeight: 170 }}
	>
		<div
			className="flex items-center justify-center w-14 h-14 rounded-full mb-4"
			style={{ backgroundColor: `rgba(var(--tw-color-${color}-500), 0.1)` }}
		>
			<div className={`text-${color}-600 dark:text-${color}-400`}>{icon}</div>
		</div>
		<p className={`text-sm font-medium text-gray-500 dark:text-gray-400 mb-1`}>
			{title}
		</p>
		<h3
			className={`text-3xl font-bold text-${color}-600 dark:text-${color}-300`}
		>
			{value}
		</h3>
	</div>
);

export default HomeTab;
