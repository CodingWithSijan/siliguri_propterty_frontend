import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
	ConversationSummary,
	fetchConversationMessages,
	fetchConversations,
	MessageItem,
	sendMessage,
} from "../services/messaging";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { showError, showSuccess } from "../utils/toastUtils";
import { getInitials } from "../utils/getInitial";

const MessagesPage: React.FC = () => {
	const { user } = useSelector((state: RootState) => state.auth);
	const [searchParams] = useSearchParams();
	const preselectedUserId = searchParams.get("userId") ?? "";
	const listingId = searchParams.get("listingId") ?? undefined;

	const [loadingConversations, setLoadingConversations] = useState(true);
	const [conversations, setConversations] = useState<ConversationSummary[]>([]);
	const [selectedUserId, setSelectedUserId] =
		useState<string>(preselectedUserId);
	const [messages, setMessages] = useState<MessageItem[]>([]);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [sending, setSending] = useState(false);
	const [content, setContent] = useState("");

	const selectedConversation = useMemo(
		() => conversations.find((item) => item.participant.id === selectedUserId),
		[conversations, selectedUserId],
	);

	const getParticipantLabel = (conversation: ConversationSummary): string => {
		return conversation.participant.role === "admin" ||
			conversation.participant.role === "superadmin"
			? "ADMIN"
			: conversation.participant.name;
	};

	useEffect(() => {
		const loadConversations = async () => {
			try {
				setLoadingConversations(true);
				const data = await fetchConversations();
				setConversations(data);

				if (!selectedUserId && data.length > 0) {
					setSelectedUserId(data[0].participant.id);
				}
			} catch {
				showError("Failed to load conversations");
			} finally {
				setLoadingConversations(false);
			}
		};

		void loadConversations();
	}, [selectedUserId]);

	useEffect(() => {
		if (!selectedUserId) {
			setMessages([]);
			return;
		}

		const loadMessages = async () => {
			try {
				setLoadingMessages(true);
				const data = await fetchConversationMessages(selectedUserId);
				setMessages(data);
			} catch {
				showError("Failed to load messages");
			} finally {
				setLoadingMessages(false);
			}
		};

		void loadMessages();
	}, [selectedUserId]);

	const handleSend = async () => {
		if (!selectedUserId) {
			showError("Select a user to send message");
			return;
		}

		if (!content.trim()) {
			showError("Message cannot be empty");
			return;
		}

		try {
			setSending(true);
			await sendMessage({
				toUserId: selectedUserId,
				content: content.trim(),
				listingId,
			});
			setContent("");
			showSuccess("Message sent");

			const refreshedMessages = await fetchConversationMessages(selectedUserId);
			setMessages(refreshedMessages);
			const refreshedConversations = await fetchConversations();
			setConversations(refreshedConversations);
		} catch {
			showError("Failed to send message");
		} finally {
			setSending(false);
		}
	};

	const getSenderRole = (
		message: MessageItem,
	): "user" | "admin" | "superadmin" => {
		if (typeof message.fromUser === "string") {
			return "user";
		}
		return message.fromUser.role;
	};

	const getSenderId = (message: MessageItem): string => {
		if (typeof message.fromUser === "string") {
			return message.fromUser;
		}
		return message.fromUser._id;
	};

	return (
		<div className="max-w-6xl mx-auto px-4 py-6">
			<h1 className="text-2xl font-semibold text-gray-900 mb-4">Messages</h1>

			<div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
				<div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
					<div className="px-4 py-3 border-b border-gray-100">
						<p className="text-sm font-semibold text-gray-900">Conversations</p>
					</div>
					<div className="max-h-[70vh] overflow-y-auto">
						{loadingConversations ? (
							<p className="text-sm text-gray-500 px-4 py-4">Loading...</p>
						) : conversations.length === 0 ? (
							<p className="text-sm text-gray-500 px-4 py-4">
								No conversations yet
							</p>
						) : (
							conversations.map((conversation) => (
								<button
									type="button"
									key={conversation.participant.id}
									onClick={() => setSelectedUserId(conversation.participant.id)}
									className={`w-full px-4 py-3 text-left border-b border-gray-100 hover:bg-gray-50 ${
										selectedUserId === conversation.participant.id
											? "bg-blue-50"
											: "bg-white"
									}`}
								>
									<div className="flex items-center gap-3">
										{conversation.participant.avatar ? (
											<img
												src={conversation.participant.avatar}
												alt={conversation.participant.name}
												className="w-10 h-10 rounded-full object-cover"
											/>
										) : (
											<div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
												{getInitials(conversation.participant.name)}
											</div>
										)}
										<div className="min-w-0 flex-1">
											<p className="text-sm font-semibold text-gray-900 truncate">
												{getParticipantLabel(conversation)}
											</p>
											<p className="text-xs text-gray-600 truncate">
												{conversation.lastMessage}
											</p>
										</div>
										{conversation.unreadCount > 0 && (
											<span className="text-xs rounded-full bg-red-600 text-white px-2 py-0.5">
												{conversation.unreadCount}
											</span>
										)}
									</div>
								</button>
							))
						)}
					</div>
				</div>

				<div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col min-h-[70vh]">
					<div className="px-4 py-3 border-b border-gray-100">
						<p className="text-sm font-semibold text-gray-900">
							{selectedConversation
								? `Chat with ${getParticipantLabel(selectedConversation)}`
								: "Select a conversation"}
						</p>
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-3">
						{loadingMessages ? (
							<p className="text-sm text-gray-500">Loading messages...</p>
						) : messages.length === 0 ? (
							<p className="text-sm text-gray-500">No messages yet.</p>
						) : (
							messages.map((message) => {
								const senderRole = getSenderRole(message);
								const isMine = getSenderId(message) === user?.id;
								const linkedListing =
									typeof message.listingId === "object"
										? message.listingId
										: null;
								const isAdminMessage =
									senderRole === "admin" || senderRole === "superadmin";
								const bubbleClassName = isMine
									? isAdminMessage
										? "ml-auto bg-slate-900 text-white"
										: "ml-auto bg-blue-600 text-white"
									: isAdminMessage
										? "mr-auto bg-amber-50 text-amber-900 border border-amber-200"
										: "mr-auto bg-gray-100 text-gray-900";
								return (
									<div
										key={message._id}
										className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${bubbleClassName}`}
									>
										<p
											className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${
												isMine ? "text-blue-100" : "text-slate-500"
											}`}
										>
											{senderRole === "admin" || senderRole === "superadmin"
												? "ADMIN"
												: "USER"}
										</p>
										<p>{message.content}</p>
										{linkedListing && (
											<div
												className={`mt-2 rounded-md border p-2 ${
													isMine
														? "border-blue-300 bg-blue-500/30"
														: "border-slate-200 bg-white"
												}`}
											>
												<p className="font-medium line-clamp-1">
													{linkedListing.title}
												</p>
												<p
													className={`text-[11px] ${
														isMine ? "text-blue-100" : "text-slate-600"
													}`}
												>
													{linkedListing.propertyCategory} •{" "}
													{linkedListing.location}
												</p>
											</div>
										)}
										<p
											className={`text-[11px] mt-1 ${
												isMine ? "text-blue-100" : "text-gray-500"
											}`}
										>
											{new Date(message.createdAt).toLocaleString()}
										</p>
									</div>
								);
							})
						)}
					</div>

					<div className="p-4 border-t border-gray-100 space-y-2">
						<Textarea
							placeholder="Type your message"
							value={content}
							onChange={(event) => setContent(event.target.value)}
							rows={3}
						/>
						<div className="flex justify-end">
							<Button type="button" onClick={handleSend} disabled={sending}>
								{sending ? "Sending..." : "Send"}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessagesPage;
