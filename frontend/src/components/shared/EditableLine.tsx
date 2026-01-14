import { useState } from "react";
import { PencilIconButton } from "../playbooks/creation/PencilIconButton";

export function EditableLine({
	text,
	editable,
	onSave,
	index,
}: {
	text: string;
	editable: boolean;
	onSave: (index: number, value: string) => void;
	index: number;
}) {
	const [showEdit, setShowEdit] = useState(false);

	const handleSave = (value: string) => {
		onSave(index, value);
		setShowEdit(false);
	};

	const showBlank = text === "";

	return (
		<div className="inline-flex justify-between items-center gap-2">
			<span className="text-sm text-theme-text-muted">◆</span>
			{showEdit ? (
				<Input text={text} onSave={(value) => handleSave(value)} />
			) : (
				<div className="flex-grow w-[60%] flex gap-2 items-center ">
					{showBlank ? (
						<BlankLine />
					) : (
						<span className="flex-grow w-[60%] text-md text-theme-text-primary flex justify-start text-left">
							{text}
						</span>
					)}
				</div>
			)}
			{editable && (
				<PencilIconButton
					isEditing={showEdit}
					setIsEditing={() => setShowEdit(!showEdit)}
				/>
			)}
		</div>
	);
}

function Input({
	text,
	onSave,
	placeholder = "",
}: {
	text: string;
	onSave: (value: string) => void;
	placeholder?: string;
}) {
	const [localText, setLocalText] = useState(text);

	const isDirty = localText !== text;

	const handleSave = () => {
		if (isDirty) {
			onSave(localText);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSave();
			if (e.target instanceof HTMLElement) {
				e.target.blur();
			}
		}
		if (e.key === "Escape") {
			setLocalText(text);
			if (e.target instanceof HTMLElement) {
				e.target.blur();
			}
		}
	};

	return (
		<div className="flex-1 min-w-0 relative flex items-center gap-2">
			<input
				type="text"
				value={localText}
				onChange={(e) => setLocalText(e.target.value)}
				onBlur={handleSave}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className={`w-full min-w-0 border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent ${
					isDirty ? "border-yellow-500/50" : "border-theme-border"
				}`}
			/>
			{isDirty && (
				<span
					className="text-yellow-500 text-xs shrink-0"
					title="Unsaved - press Enter"
				>
					●
				</span>
			)}
		</div>
	);
}

function BlankLine() {
	return (
		<div className="flex-1 min-w-0 h-[1.5em] border-b border-theme-text-muted" />
	);
}
