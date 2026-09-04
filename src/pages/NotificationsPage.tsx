import React, { useEffect, useState } from "react";
import {
	fetchNotifications,
	markAllNotificationsRead,
	markNotificationRead,
	NotificationItem,
} from "../services/messaging";
import { Button } from "../components/ui/button";
import { showError, showSuccess } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";

const NotificationsPage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				const data = await fetchNotifications();
				setNotifications(data);
			} catch {
				showError("Failed to load notifications");
			} finally {
				setLoading(false);
			}
		};

		void load();
	}, []);

	const handleReadAll = async () => {
		try {
			await markAllNotificationsRead();
			setNotifications((prev) =>
				prev.map((item) => ({ ...item, isRead: true })),
			);
			showSuccess("All notifications marked as read");
		} catch {
			showError("Failed to mark notifications as read");
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-6">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
				<Button type="button" onClick={handleReadAll} variant="outline">
					Mark all as read
				</Button>
			</div>

			<div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
				{loading ? (
					<p className="px-4 py-6 text-sm text-gray-500">
						Loading notifications...
					</p>
				) : notifications.length === 0 ? (
					<p className="px-4 py-6 text-sm text-gray-500">
						No notifications found.
					</p>
				) : (
					notifications.map((item) => (
						<button
							type="button"
							key={item._id}
							onClick={async () => {
								if (!item.isRead) {
									await markNotificationRead(item._id);
									setNotifications((prev) =>
										prev.map((entry) =>
											entry._id === item._id
												? { ...entry, isRead: true }
												: entry,
										),
									);
								}

								if (item.link) {
									navigate(item.link);
								}
							}}
							className={`w-full text-left px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
								item.isRead ? "bg-white" : "bg-blue-50"
							}`}
						>
							<p className="text-sm font-semibold text-gray-900">
								{item.title}
							</p>
							<p className="text-sm text-gray-700 mt-1">{item.message}</p>
							<p className="text-xs text-gray-500 mt-2">
								{new Date(item.createdAt).toLocaleString()}
							</p>
						</button>
					))
				)}
			</div>
		</div>
	);
};

export default NotificationsPage;
