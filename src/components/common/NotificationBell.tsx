import React, { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
	fetchNotifications,
	fetchUnreadNotificationCount,
	markAllNotificationsRead,
	markNotificationRead,
	NotificationItem,
} from "../../services/messaging";
import { cn } from "../../lib/utils";

interface NotificationBellProps {
	buttonClassName?: string;
}

const formatTimeAgo = (dateString: string): string => {
	const diff = Date.now() - new Date(dateString).getTime();
	const minutes = Math.floor(diff / (1000 * 60));
	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
};

const NotificationBell: React.FC<NotificationBellProps> = ({
	buttonClassName,
}) => {
	const navigate = useNavigate();
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth,
	);
	const defaultNotificationsPath =
		user?.role === "admin"
			? "/admin/notifications"
			: "/dashboard/notifications";
	const [open, setOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const topNotifications = useMemo(
		() => notifications.slice(0, 6),
		[notifications],
	);

	useEffect(() => {
		if (!isAuthenticated) return;

		const loadUnread = async () => {
			try {
				const count = await fetchUnreadNotificationCount();
				setUnreadCount(count);
			} catch {
				setUnreadCount(0);
			}
		};

		void loadUnread();
		const interval = window.setInterval(() => {
			void loadUnread();
		}, 20000);

		return () => window.clearInterval(interval);
	}, [isAuthenticated]);

	useEffect(() => {
		if (!open || !isAuthenticated) return;
		const loadNotifications = async () => {
			try {
				const data = await fetchNotifications();
				setNotifications(data);
			} catch {
				setNotifications([]);
			}
		};
		void loadNotifications();
	}, [open, isAuthenticated]);

	if (!isAuthenticated) return null;

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className={cn(
					"relative rounded-full p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors",
					buttonClassName,
				)}
				aria-label="Open notifications"
			>
				<Bell className="h-5 w-5" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
						{unreadCount > 99 ? "99+" : unreadCount}
					</span>
				)}
			</button>

			{open && (
				<div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
					<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
						<p className="text-sm font-semibold text-gray-900">Notifications</p>
						<button
							type="button"
							onClick={async () => {
								await markAllNotificationsRead();
								setNotifications((prev) =>
									prev.map((item) => ({ ...item, isRead: true })),
								);
								setUnreadCount(0);
							}}
							className="text-xs font-medium text-blue-600 hover:underline"
						>
							Mark all read
						</button>
					</div>

					<div className="max-h-96 overflow-y-auto">
						{topNotifications.length === 0 ? (
							<p className="text-sm text-gray-500 px-4 py-6 text-center">
								No notifications yet.
							</p>
						) : (
							topNotifications.map((item) => (
								<button
									type="button"
									key={item._id}
									onClick={async () => {
										if (!item.isRead) {
											await markNotificationRead(item._id);
											setUnreadCount((prev) => Math.max(prev - 1, 0));
										}
										setOpen(false);
										if (item.link) {
											navigate(item.link);
										} else {
											navigate(defaultNotificationsPath);
										}
									}}
									className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
										item.isRead ? "bg-white" : "bg-blue-50"
									}`}
								>
									<p className="text-sm font-medium text-gray-900">
										{item.title}
									</p>
									<p className="text-xs text-gray-600 mt-0.5">{item.message}</p>
									<p className="text-[11px] text-gray-500 mt-1">
										{formatTimeAgo(item.createdAt)}
									</p>
								</button>
							))
						)}
					</div>

					<button
						type="button"
						onClick={() => {
							setOpen(false);
							navigate(defaultNotificationsPath);
						}}
						className="w-full py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 border-t border-gray-100"
					>
						View all notifications
					</button>
				</div>
			)}
		</div>
	);
};

export default NotificationBell;
