import { useCallback, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { PlayerRole } from "../../../context/types";
import { PencilIconButton } from "../creation/PencilIconButton";
import type { Character } from "../types";

export function Conditions({ character }: { character: Character }) {
	const {
		updateGameState,
		gameState,
		user: { id, role },
	} = useGame();
	const editable = id === character.playerId || role === PlayerRole.KEEPER;
	const [showEdit, setShowEdit] = useState<Record<number, boolean>>({
		0: false,
		1: false,
		2: false,
	});

	// Sync conditions to Firebase
	const syncConditions = useCallback(
		(newConditions: string[]) => {
			updateGameState({
				players: gameState.players.map((player) =>
					player.id === character.playerId
						? {
								...player,
								character: player.character
									? { ...player.character, conditions: newConditions }
									: null,
							}
						: player,
				),
			});
		},
		[updateGameState, gameState.players, character.playerId],
	);

	const handleSaveCondition = (index: number, value: string) => {
		const defaultConditions: string[] = ["", "", ""];
		const newConditions = [...(character.conditions ?? defaultConditions)];
		newConditions[index] = value;
		syncConditions(newConditions);
		setShowEdit({ ...showEdit, [index]: false });
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			{Array.from({ length: 3 }).map((_, index) => {
				const condition = character.conditions?.[index] ?? "";
				const showBlank = condition === "";
				return (
					<div
						key={`condition-${index}-${condition}}`}
						className="inline-flex justify-between items-center gap-2"
					>
						<span className="text-sm text-theme-text-secondary">◆</span>
						{showEdit[index] ? (
							<ConditionInput
								condition={condition}
								onSave={(value) => handleSaveCondition(index, value)}
							/>
						) : (
							<div className="flex-grow w-[60%] flex gap-2 items-center ">
								{showBlank ? (
									<BlankCondition />
								) : (
									<span className="flex-grow w-[60%] text-md text-theme-text-primary flex justify-start">
										{condition}
									</span>
								)}
							</div>
						)}
						{editable && (
							<PencilIconButton
								isEditing={showEdit[index]}
								setIsEditing={() =>
									setShowEdit({ ...showEdit, [index]: !showEdit[index] })
								}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

export function ConditionInput({
	condition,
	onSave,
	placeholder = "Add condition...",
}: {
	condition: string;
	onSave: (value: string) => void;
	placeholder?: string;
}) {
	const [localText, setLocalText] = useState(condition);

	const isDirty = localText !== condition;

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
			setLocalText(condition);
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

export function BlankCondition() {
	return (
		<div className="flex-1 min-w-0 h-[1.5em] border-b border-theme-text-muted/30" />
	);
}
