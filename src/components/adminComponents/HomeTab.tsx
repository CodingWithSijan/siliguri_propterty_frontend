import React, { useCallback } from "react";
import { Link } from "react-router-dom";
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
	ArrowRight,
	Sparkles,
	TriangleAlert,
	UserCog,
	MessageSquareMore,
	Star,
} from "lucide-react";

const formatNumber = (value: number) =>
	new Intl.NumberFormat("en-IN").format(value ?? 0);

interface MetricCardProps {
	title: string;
	value: number;
	description: string;
	icon: React.ReactNode;
	colorClass: string;
	bgClass: string;
}

interface QueueItemProps {
	label: string;
	count: number;
	to: string;
	stateClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
	title,
	value,
	description,
	icon,
	colorClass,
	bgClass,
}) => (
	<article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-emerald-200 md:p-5">
		<div className="flex items-start justify-between gap-3">
			<div>
				<p className="text-sm font-medium text-slate-500">{title}</p>
				<h3 className={`mt-1 text-2xl font-bold md:text-3xl ${colorClass}`}>
					{formatNumber(value)}
				</h3>
			</div>
			<div className={`rounded-full p-2.5 ${bgClass} ${colorClass}`}>
				{icon}
			</div>
		</div>
		<p className="mt-2 text-xs text-slate-600">{description}</p>
	</article>
);

const QueueItem: React.FC<QueueItemProps> = ({
	label,
	count,
	to,
	stateClass,
}) => (
	<Link
		to={to}
		className="group flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
	>
		<span className="text-sm text-slate-800">{label}</span>
		<span
			className={`inline-flex min-w-[2.25rem] items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${stateClass}`}
		>
			{formatNumber(count)}
		</span>
	</Link>
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
					{formatNumber(count)} ({value}%)
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

const HomeTab: React.FC = () => {
	const fetchAnalyticsData = useCallback(() => fetchAnalytics(), []);
	const { data, loading, error } = useFetch(fetchAnalyticsData);

	if (loading) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
				<div className="flex items-center gap-3">
					<div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
					<span>Loading dashboard insights...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
				Unable to load analytics: {error?.message}
			</div>
		);
	}

	if (!data) {
		return null;
	}

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

	const moderationBacklog = pendingPosts + rejectedPosts;

	const overviewCards = [
		{
			title: "Total Users",
			value: totalUsers,
			description: `${verificationRate}% verified coverage`,
			colorClass: "text-sky-700",
			bgClass: "bg-sky-50",
			icon: <Users className="h-5 w-5" />,
		},
		{
			title: "Total Listings",
			value: totalPosts,
			description: `${formatNumber(pendingPosts)} pending review`,
			colorClass: "text-indigo-700",
			bgClass: "bg-indigo-50",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			title: "Approved",
			value: approvedPosts,
			description: `${approvalRate}% approval rate`,
			colorClass: "text-emerald-700",
			bgClass: "bg-emerald-50",
			icon: <CheckCircle2 className="h-5 w-5" />,
		},
		{
			title: "Backlog",
			value: moderationBacklog,
			description: "Pending + rejected queue",
			colorClass: "text-amber-700",
			bgClass: "bg-amber-50",
			icon: <Clock className="h-5 w-5" />,
		},
		{
			title: "Verified Users",
			value: verifiedUsers,
			description: "Eligible for trusted interactions",
			colorClass: "text-emerald-700",
			bgClass: "bg-emerald-50",
			icon: <UserCheck className="h-5 w-5" />,
		},
		{
			title: "Unverified Users",
			value: unverifiedUsers,
			description: "Nudge for verification",
			colorClass: "text-amber-700",
			bgClass: "bg-amber-50",
			icon: <UserX className="h-5 w-5" />,
		},
		{
			title: "Pending Posts",
			value: pendingPosts,
			description: "Awaiting moderation decision",
			colorClass: "text-amber-700",
			bgClass: "bg-amber-50",
			icon: <Clock className="h-5 w-5" />,
		},
		{
			title: "Rejected Posts",
			value: rejectedPosts,
			description: `${rejectionRate}% rejection rate`,
			colorClass: "text-rose-700",
			bgClass: "bg-rose-50",
			icon: <XCircle className="h-5 w-5" />,
		},
	];

	const healthTone =
		pendingRate >= 35 || rejectionRate >= 30 || verificationRate < 60
			? "attention"
			: "stable";

	const quickActions = [
		{
			label: "Review Pending Posts",
			description: `${formatNumber(pendingPosts)} listings waiting moderation`,
			to: "/admin/posts",
			icon: <FileText className="h-4 w-4" />,
		},
		{
			label: "Manage User Verification",
			description: `${formatNumber(unverifiedUsers)} users need follow-up`,
			to: "/admin/users",
			icon: <UserCog className="h-4 w-4" />,
		},
		{
			label: "Open Admin Messages",
			description: "Respond to unresolved user conversations",
			to: "/admin/messages",
			icon: <MessageSquareMore className="h-4 w-4" />,
		},
		{
			label: "Tune Featured Listings",
			description: "Keep the homepage fresh with top inventory",
			to: "/admin/featured-properties",
			icon: <Star className="h-4 w-4" />,
		},
	];

	return (
		<div className="space-y-6">
			<section className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-5 shadow-sm md:p-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
							<Sparkles className="h-3.5 w-3.5" />
							Admin Operations Brief
						</div>
						<h2 className="mt-3 text-xl font-bold text-slate-900 md:text-2xl">
							Platform Health Command Center
						</h2>
						<p className="mt-2 max-w-2xl text-sm text-slate-600">
							Monitor moderation pressure, verification progress and operational
							focus areas from one place.
						</p>
					</div>

					<div
						className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${
							healthTone === "attention"
								? "border-amber-200 bg-amber-50 text-amber-800"
								: "border-emerald-200 bg-emerald-50 text-emerald-800"
						}`}
					>
						<p className="flex items-center gap-2 font-semibold">
							{healthTone === "attention" ? (
								<TriangleAlert className="h-4 w-4" />
							) : (
								<ShieldCheck className="h-4 w-4" />
							)}
							{healthTone === "attention"
								? "Attention Needed"
								: "System Stable"}
						</p>
						<p className="mt-1 text-xs opacity-90">
							Approval {approvalRate}% · Pending {pendingRate}% · Verification{" "}
							{verificationRate}%
						</p>
					</div>
				</div>
			</section>

			<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{overviewCards.map((card) => (
					<MetricCard
						key={card.title}
						title={card.title}
						value={card.value}
						description={card.description}
						icon={card.icon}
						colorClass={card.colorClass}
						bgClass={card.bgClass}
					/>
				))}
			</section>

			<section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
				<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
					<div className="mb-4 flex items-center gap-2 text-slate-800">
						<TrendingUp className="h-5 w-5" />
						<h3 className="text-base font-semibold">Moderation Distribution</h3>
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

				<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
					<div className="mb-4 flex items-center gap-2 text-slate-800">
						<ShieldCheck className="h-5 w-5" />
						<h3 className="text-base font-semibold">Verification Health</h3>
					</div>
					<div className="mb-3 text-sm text-slate-600">
						{verificationRate}% of users verified
					</div>
					<div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full bg-emerald-500 transition-all"
							style={{ width: `${verificationRate}%` }}
						/>
					</div>
					<div className="mt-4 space-y-2 text-sm">
						<div className="flex items-center justify-between rounded-md bg-emerald-50 px-3 py-2 text-emerald-800">
							<span>Verified</span>
							<span className="font-semibold">
								{formatNumber(verifiedUsers)}
							</span>
						</div>
						<div className="flex items-center justify-between rounded-md bg-amber-50 px-3 py-2 text-amber-800">
							<span>Pending Verification</span>
							<span className="font-semibold">
								{formatNumber(unverifiedUsers)}
							</span>
						</div>
					</div>
				</div>
			</section>

			<section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
					<h3 className="text-base font-semibold text-slate-900">
						Priority Queue
					</h3>
					<p className="mt-1 text-sm text-slate-600">
						Focus here first to keep moderation turnaround healthy.
					</p>
					<div className="mt-4 space-y-2">
						<QueueItem
							label="Pending approvals"
							count={pendingPosts}
							to="/admin/posts"
							stateClass="text-amber-700 bg-amber-50"
						/>
						<QueueItem
							label="Rejected requiring audit"
							count={rejectedPosts}
							to="/admin/posts"
							stateClass="text-rose-700 bg-rose-50"
						/>
						<QueueItem
							label="Users pending verification"
							count={unverifiedUsers}
							to="/admin/users"
							stateClass="text-indigo-700 bg-indigo-50"
						/>
					</div>
				</div>

				<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
					<h3 className="text-base font-semibold text-slate-900">
						Quick Actions
					</h3>
					<p className="mt-1 text-sm text-slate-600">
						Jump directly into high-impact admin workflows.
					</p>
					<div className="mt-4 space-y-2">
						{quickActions.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								className="group flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
							>
								<div className="min-w-0">
									<p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
										{item.icon}
										{item.label}
									</p>
									<p className="truncate text-xs text-slate-600">
										{item.description}
									</p>
								</div>
								<ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-700" />
							</Link>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomeTab;
