import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
	ConversationSummary,
	fetchMessageRecipients,
	fetchConversationMessages,
	fetchConversations,
	MessageRecipient,
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
	const isAdminUser = user?.role === "admin" || user?.role === "superadmin";

	const [loadingConversations, setLoadingConversations] = useState(true);
	const [conversations, setConversations] = useState<ConversationSummary[]>([]);
	const [recipientOptions, setRecipientOptions] = useState<MessageRecipient[]>(
		[],
	);
	const [loadingRecipients, setLoadingRecipients] = useState(false);
	const [recipientQuery, setRecipientQuery] = useState("");
	const [selectedUserId, setSelectedUserId] =
		useState<string>(preselectedUserId);
	const [messages, setMessages] = useState<MessageItem[]>([]);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [sending, setSending] = useState(false);
	const [content, setContent] = useState("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const selectedConversation = useMemo(
		() => conversations.find((item) => item.participant.id === selectedUserId),
		[conversations, selectedUserId],
	);

	const selectedRecipient = useMemo(
		() =>
			recipientOptions.find((recipient) => recipient._id === selectedUserId),
		[recipientOptions, selectedUserId],
	);

	const sortedRecipientOptions = useMemo(() => {
		const roleOrder: Record<MessageRecipient["role"], number> = {
			superadmin: 0,
			admin: 1,
			user: 2,
		};

		return [...recipientOptions].sort((a, b) => {
			const roleDelta = roleOrder[a.role] - roleOrder[b.role];
			if (roleDelta !== 0) {
				return roleDelta;
			}
			return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
		});
	}, [recipientOptions]);

	const getParticipantLabel = (conversation: ConversationSummary): string => {
		const role = conversation.participant.role ?? "user";
		if (role === "admin" || role === "superadmin") {
			return `${conversation.participant.name} (ADMIN)`;
		}
		return conversation.participant.name;
	};

	const getRecipientLabel = (recipient: MessageRecipient): string => {
		if (recipient.role === "admin" || recipient.role === "superadmin") {
			return `${recipient.name} (ADMIN)`;
		}
		return recipient.name;
	};

	const getRoleLabel = (role?: "user" | "admin" | "superadmin"): string => {
		if (role === "superadmin") {
			return "SUPER ADMIN";
		}
		if (role === "admin") {
			return "ADMIN";
		}
		return "USER";
	};

	const getRoleBadgeClassName = (
		role?: "user" | "admin" | "superadmin",
	): string => {
		if (role === "superadmin") {
			return "bg-purple-100 text-purple-800";
		}
		if (role === "admin") {
			return "bg-amber-100 text-amber-800";
		}
		return "bg-slate-100 text-slate-700";
	};

	const formatMessageTime = (value: string): string => {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return "";
		}
		return new Intl.DateTimeFormat("en-IN", {
			hour: "2-digit",
			minute: "2-digit",
			day: "2-digit",
			month: "short",
		}).format(date);
	};

	const formatConversationTime = (value: string): string => {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return "";
		}
		return new Intl.DateTimeFormat("en-IN", {
			day: "2-digit",
			month: "short",
		}).format(date);
	};

	const selectedRole =
		selectedConversation?.participant.role || selectedRecipient?.role;
	const selectedName = selectedConversation
		? getParticipantLabel(selectedConversation)
		: selectedRecipient
			? getRecipientLabel(selectedRecipient)
			: "";

	const canSend =
		Boolean(selectedUserId) && Boolean(content.trim()) && !sending;

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
	}, []);

	useEffect(() => {
		if (!isAdminUser) {
			return;
		}

		const loadRecipients = async () => {
			try {
				setLoadingRecipients(true);
				const recipients = await fetchMessageRecipients(recipientQuery);
				setRecipientOptions(recipients);
			} catch {
				showError("Failed to load users");
			} finally {
				setLoadingRecipients(false);
			}
		};

		void loadRecipients();
	}, [isAdminUser, recipientQuery]);

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

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [messages]);

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

	const handleMessageKeyDown = (
		event: React.KeyboardEvent<HTMLTextAreaElement>,
	) => {
		if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
			event.preventDefault();
			if (canSend) {
				void handleSend();
			}
		}
	};

	return (
		<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div className="mb-4 flex items-end justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">Messages</h1>
					<p className="mt-1 text-sm text-slate-600">
						Communicate quickly with clear conversation context.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
				<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
					<div className="border-b border-slate-100 px-4 py-3">
						<p className="text-sm font-semibold text-slate-900">
							Conversations
						</p>
						{isAdminUser && (
							<div className="mt-3 space-y-2">
								<input
									type="text"
									value={recipientQuery}
									onChange={(event) => setRecipientQuery(event.target.value)}
									placeholder="Search user by name or email"
									className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500"
								/>
								<select
									value={selectedUserId}
									onChange={(event) => setSelectedUserId(event.target.value)}
									className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500"
								>
									<option value="">Select user to message</option>
									{sortedRecipientOptions.map((recipient) => (
										<option key={recipient._id} value={recipient._id}>
											[{getRoleLabel(recipient.role)}]{" "}
											{getRecipientLabel(recipient)} - {recipient.email}
										</option>
									))}
								</select>
								<div className="max-h-36 space-y-1 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-2">
									{sortedRecipientOptions.map((recipient) => {
										const isSelected = selectedUserId === recipient._id;
										return (
											<button
												type="button"
												key={`chip-${recipient._id}`}
												onClick={() => setSelectedUserId(recipient._id)}
												className={`flex w-full items-center justify-between rounded-md border px-2 py-1.5 text-left text-xs transition ${
													isSelected
														? "border-emerald-300 bg-emerald-50"
														: "border-slate-200 bg-white hover:border-emerald-200"
												}`}
											>
												<span className="truncate pr-2 text-slate-700">
													{recipient.name}
												</span>
												<span
													className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${getRoleBadgeClassName(
														recipient.role,
													)}`}
												>
													{getRoleLabel(recipient.role)}
												</span>
											</button>
										);
									})}
								</div>
								{loadingRecipients && (
									<p className="text-xs text-slate-500">Loading users...</p>
								)}
							</div>
						)}
					</div>
					<div className="max-h-[72vh] overflow-y-auto bg-slate-50/30">
						{loadingConversations ? (
							<p className="px-4 py-4 text-sm text-slate-500">Loading...</p>
						) : conversations.length === 0 ? (
							<p className="px-4 py-4 text-sm text-slate-500">
								No conversations yet
							</p>
						) : (
							conversations.map((conversation) => (
								<button
									type="button"
									key={conversation.participant.id}
									onClick={() => setSelectedUserId(conversation.participant.id)}
									className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
										selectedUserId === conversation.participant.id
											? "bg-emerald-50/70"
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
											<div className="flex items-start justify-between gap-2">
												<p className="truncate text-sm font-semibold text-slate-900">
													{getParticipantLabel(conversation)}
												</p>
												<span className="shrink-0 text-[11px] text-slate-500">
													{formatConversationTime(conversation.lastMessageAt)}
												</span>
											</div>
											<p className="truncate text-xs text-slate-600">
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

				<div className="flex min-h-[72vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
					<div className="border-b border-slate-100 px-4 py-3">
						<div className="flex items-center gap-3">
							{selectedName ? (
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
									{getInitials(selectedName)}
								</div>
							) : (
								<div className="h-10 w-10 rounded-full bg-slate-200" />
							)}
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-slate-900">
									{selectedName || "Select a conversation"}
								</p>
								{selectedRole && (
									<span
										className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${getRoleBadgeClassName(selectedRole)}`}
									>
										{getRoleLabel(selectedRole)}
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto bg-slate-50/70 p-4">
						{loadingMessages ? (
							<p className="text-sm text-slate-500">Loading messages...</p>
						) : !selectedUserId ? (
							<div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/80 p-6 text-center text-sm text-slate-500">
								Select a conversation from the left panel or choose a user to
								start messaging.
							</div>
						) : messages.length === 0 ? (
							<div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/80 p-6 text-center text-sm text-slate-500">
								No messages yet. Start the conversation with a clear first
								message.
							</div>
						) : (
							<div className="space-y-3">
								{messages.map((message) => {
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
											: "ml-auto bg-emerald-600 text-white"
										: isAdminMessage
											? "mr-auto border border-amber-200 bg-amber-50 text-amber-900"
											: "mr-auto border border-slate-200 bg-white text-slate-900";
									return (
										<div
											key={message._id}
											className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm shadow-sm ${bubbleClassName}`}
										>
											<div className="mb-1 flex items-center justify-between gap-2">
												<p
													className={`text-[10px] font-semibold uppercase tracking-wide ${
														isMine ? "text-emerald-100" : "text-slate-500"
													}`}
												>
													{senderRole === "admin" || senderRole === "superadmin"
														? "ADMIN"
														: "USER"}
												</p>
												<p
													className={`text-[10px] ${
														isMine ? "text-emerald-100" : "text-slate-500"
													}`}
												>
													{formatMessageTime(message.createdAt)}
												</p>
											</div>
											<p className="whitespace-pre-wrap leading-relaxed">
												{message.content}
											</p>
											{linkedListing && (
												<div
													className={`mt-2 rounded-xl border p-2 ${
														isMine
															? "border-emerald-300 bg-emerald-500/20"
															: "border-slate-200 bg-white"
													}`}
												>
													<p className="line-clamp-1 font-medium">
														{linkedListing.title}
													</p>
													<p
														className={`text-[11px] ${
															isMine ? "text-emerald-100" : "text-slate-600"
														}`}
													>
														{linkedListing.propertyCategory} •{" "}
														{linkedListing.location}
													</p>
												</div>
											)}
										</div>
									);
								})}
								<div ref={messagesEndRef} />
							</div>
						)}
					</div>

					<div className="space-y-2 border-t border-slate-100 bg-white p-4">
						<Textarea
							placeholder={
								selectedUserId
									? "Type your message (Ctrl/Cmd + Enter to send)"
									: "Select a conversation to start typing"
							}
							value={content}
							onChange={(event) => setContent(event.target.value)}
							onKeyDown={handleMessageKeyDown}
							rows={3}
							disabled={!selectedUserId || sending}
							className="resize-none"
						/>
						<div className="flex items-center justify-between gap-3">
							<p className="text-xs text-slate-500">
								{content.trim().length}/2000 characters
							</p>
							<Button
								type="button"
								onClick={handleSend}
								disabled={!canSend}
								className="min-w-28"
							>
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
