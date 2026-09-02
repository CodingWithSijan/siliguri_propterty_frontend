import React, { useCallback } from "react";
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
	TrendingUp,
	ShieldCheck,
} from "lucide-react";

const HomeTab: React.FC = () => {
	const fetchAnalyticsData = useCallback(() => fetchAnalytics(), []);
	const { data, loading, error } = useFetch(fetchAnalyticsData);

	if (loading) return <div className="p-4">Loading analytics...</div>;
	if (error) return <div className="text-red-500">{error?.message}</div>;
	if (!data) return null;

	const totalPosts = data.postsRes ?? 0;
	const approvedPosts = data.approvedPostsRes ?? 0;
	const pendingPosts = data.pendingPostsRes ?? 0;
	const rejectedPosts = data.rejectedPostsRes ?? 0;
	const totalUsers = data.usersRes ?? 0;
	const verifiedUsers = data.verifiedUsersRes ?? 0;
	const unverifiedUsers = data.unverifiedUsersRes ?? 0;

	const approvalRate =
		totalPosts > 0 ? Math.round((approvedPosts / totalPosts) * 100) : 0;
	const pendingRate =
		totalPosts > 0 ? Math.round((pendingPosts / totalPosts) * 100) : 0;
	const rejectionRate =
		totalPosts > 0 ? Math.round((rejectedPosts / totalPosts) * 100) : 0;
	const verificationRate =
		totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;

	// Card data array for easy mapping and ordering
	const cards = [
		{
			colorClass: "text-blue-700",
			bgClass: "bg-blue-50",
			title: "Total Users",
			value: totalUsers,
			icon: <Users size={32} className="mb-2" />,
		},
		{
			colorClass: "text-emerald-700",
			bgClass: "bg-emerald-50",
			title: "Verified Users",
			value: verifiedUsers,
			icon: <UserCheck size={32} className="mb-2" />,
		},
		{
			colorClass: "text-amber-700",
			bgClass: "bg-amber-50",
			title: "Unverified Users",
			value: unverifiedUsers,
			icon: <UserX size={32} className="mb-2" />,
		},
		{
			colorClass: "text-indigo-700",
			bgClass: "bg-indigo-50",
			title: "Total Posts",
			value: totalPosts,
			icon: <FileText size={32} className="mb-2" />,
		},
		{
			colorClass: "text-emerald-700",
			bgClass: "bg-emerald-50",
			title: "Approved Posts",
			value: approvedPosts,
			icon: <CheckCircle2 size={32} className="mb-2" />,
		},
		{
			colorClass: "text-amber-700",
			bgClass: "bg-amber-50",
			title: "Pending Posts",
			value: pendingPosts,
			icon: <Clock size={32} className="mb-2" />,
		},
		{
			colorClass: "text-rose-700",
			bgClass: "bg-rose-50",
			title: "Rejected Posts",
			value: rejectedPosts,
			icon: <XCircle size={32} className="mb-2" />,
		},
	];

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{cards.map((card) => (
					<Card
						key={card.title}
						colorClass={card.colorClass}
						bgClass={card.bgClass}
						title={card.title}
						value={card.value}
						icon={card.icon}
					/>
				))}
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<div className="rounded-xl border bg-white p-5 shadow-sm">
					<div className="mb-4 flex items-center gap-2 text-slate-800">
						<TrendingUp className="h-5 w-5" />
						<h3 className="text-base font-semibold">Post Approval Funnel</h3>
					</div>

					<FunnelBar
						label="Approved"
						value={approvalRate}
						count={approvedPosts}
						barClass="bg-emerald-500"
					/>
					<FunnelBar
						label="Pending"
						value={pendingRate}
						count={pendingPosts}
						barClass="bg-amber-500"
					/>
					<FunnelBar
						label="Rejected"
						value={rejectionRate}
						count={rejectedPosts}
						barClass="bg-rose-500"
					/>
				</div>

				<div className="rounded-xl border bg-white p-5 shadow-sm">
					<div className="mb-4 flex items-center gap-2 text-slate-800">
						<ShieldCheck className="h-5 w-5" />
						<h3 className="text-base font-semibold">
							User Verification Health
						</h3>
					</div>
					<div className="mb-3 text-sm text-slate-600">
						{verificationRate}% users are verified
					</div>
					<div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full bg-emerald-500 transition-all"
							style={{ width: `${verificationRate}%` }}
						/>
					</div>
					<div className="mt-4 grid grid-cols-2 gap-3">
						<div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
							<div className="text-xs text-emerald-700">Verified</div>
							<div className="text-lg font-semibold text-emerald-800">
								{verifiedUsers}
							</div>
						</div>
						<div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
							<div className="text-xs text-amber-700">Pending Verification</div>
							<div className="text-lg font-semibold text-amber-800">
								{unverifiedUsers}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

interface CardProps {
	colorClass: string;
	bgClass: string;
	title: string;
	value: number;
	icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
	colorClass,
	bgClass,
	title,
	value,
	icon,
}) => (
	<div
		className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
		tabIndex={0}
		role="button"
		aria-label={title}
		style={{ minHeight: 150 }}
	>
		<div
			className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${bgClass}`}
		>
			<div className={colorClass}>{icon}</div>
		</div>
		<p className="mb-1 text-sm font-medium text-slate-500">{title}</p>
		<h3 className={`text-3xl font-bold ${colorClass}`}>{value}</h3>
	</div>
);

const FunnelBar = ({
	label,
	value,
	count,
	barClass,
}: {
	label: string;
	value: number;
	count: number;
	barClass: string;
}) => {
	return (
		<div className="mb-4">
			<div className="mb-1 flex items-center justify-between text-sm text-slate-600">
				<span>{label}</span>
				<span>
					{count} ({value}%)
				</span>
			</div>
			<div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
				<div
					className={`h-full transition-all ${barClass}`}
					style={{ width: `${value}%` }}
				/>
			</div>
		</div>
	);
};

export default HomeTab;
