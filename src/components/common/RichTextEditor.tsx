// components/common/RichTextEditor.tsx
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "../../styles/RichTextEditor.css";
import {
	MdFormatListBulleted,
	MdFormatBold,
	MdFormatItalic,
	MdFormatStrikethrough,
	MdFormatListNumbered,
	MdEmojiEmotions,
} from "react-icons/md";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
	value,
	onChange,
	placeholder = "Enter description...",
	disabled = false,
}) => {
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					HTMLAttributes: {
						class: "tiptap-bullet-list",
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: "tiptap-ordered-list",
					},
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content: value,
		editable: !disabled,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	const handleEmojiClick = (emojiData: EmojiClickData) => {
		if (editor) {
			editor.chain().focus().insertContent(emojiData.emoji).run();
			setShowEmojiPicker(false);
		}
	};

	if (!editor) {
		return null;
	}

	return (
		<div className="tiptap-editor">
			{/* Toolbar */}
			{!disabled && (
				<div className="toolbar">
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleBold().run()}
						className={editor.isActive("bold") ? "is-active" : ""}
						title="Bold"
					>
						<MdFormatBold className="text-xl" />
					</button>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						className={editor.isActive("italic") ? "is-active" : ""}
						title="Italic"
					>
						<MdFormatItalic className="text-xl" />
					</button>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleStrike().run()}
						className={editor.isActive("strike") ? "is-active" : ""}
						title="Strikethrough"
					>
						<MdFormatStrikethrough className="text-xl" />
					</button>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={editor.isActive("bulletList") ? "is-active" : ""}
						title="Bullet List"
					>
						<MdFormatListBulleted className="text-xl" />
					</button>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={editor.isActive("orderedList") ? "is-active" : ""}
						title="Numbered List"
					>
						<MdFormatListNumbered className="text-xl" />
					</button>
					<button
						type="button"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						className={
							editor.isActive("heading", { level: 2 }) ? "is-active" : ""
						}
						title="Heading 2"
					>
						H2
					</button>
					<button
						type="button"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						className={
							editor.isActive("heading", { level: 3 }) ? "is-active" : ""
						}
						title="Heading 3"
					>
						H3
					</button>

					{/* Emoji Button */}
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowEmojiPicker(!showEmojiPicker)}
							className={showEmojiPicker ? "is-active" : ""}
							title="Add Emoji"
						>
							<MdEmojiEmotions className="text-xl" />
						</button>

						{/* Emoji Picker Popup */}
						{showEmojiPicker && (
							<div className="emoji-picker-container">
								<EmojiPicker
									onEmojiClick={handleEmojiClick}
									width={300}
									height={400}
								/>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Editor Content */}
			<EditorContent editor={editor} />
		</div>
	);
};

export default RichTextEditor;
