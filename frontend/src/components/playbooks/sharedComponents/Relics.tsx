import { useCallback, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { PencilIconButton } from "../creation/PencilIconButton";
import type { Character } from "../types";
import { BlankCondition, ConditionInput } from "./Conditions";

export function Relics({ character }: { character: Character }) {
	const {
		updateGameState,
		gameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;

	const toggleAspect = useCallback(
		(aspectIndex: number) => {
			if (!editable) return;

			const currentAspects = character.relicAspects ?? [];
			const newAspects = [...currentAspects];
			newAspects[aspectIndex] = newAspects[aspectIndex] === 1 ? 0 : 1;

			updateGameState({
				players: gameState.players.map((player) =>
					player.id === character.playerId
						? {
								...player,
								character: player.character
									? { ...player.character, relicAspects: newAspects }
									: null,
							}
						: player,
				),
			});
		},
		[editable, character, updateGameState, gameState.players],
	);

	// Track global aspect index across all relics
	let globalAspectIndex = 0;

	return (
		<div className="flex flex-col gap-3 w-full">
			{character.relics.map((relic) => {
				const parsed = parseRelicText(
					relic.text,
					character.relicAspects ?? [],
					globalAspectIndex,
					editable,
					toggleAspect,
				);
				globalAspectIndex = parsed.nextAspectIndex;

				return (
					<div key={relic.title} className="flex flex-col gap-1">
						<h3 className="text-sm font-bold text-theme-text-accent">
							{relic.title}
						</h3>
						<p className="text-sm leading-relaxed">{parsed.elements}</p>
						{editable &&
							relic.extraLines > 0 &&
							Array.from({ length: relic.extraLines }).map((_, index) => (
								<EditableLine
									relic={relic}
									key={`extra-line-${
										// biome-ignore lint/suspicious/noArrayIndexKey: order unimportant
										index
									}`}
								/>
							))}
					</div>
				);
			})}
		</div>
	);
}

/**
 * Parse relic text and render <aspect> tags with checkboxes
 */
export function parseRelicText(
	text: string,
	relicAspects: number[],
	startIndex: number,
	editable: boolean,
	onToggle: (index: number) => void,
): { elements: React.ReactNode; nextAspectIndex: number } {
	const parts: React.ReactNode[] = [];
	let currentIndex = startIndex;
	let lastEnd = 0;

	// Match all <aspect>...</aspect> patterns
	const regex = /<aspect>(.*?)<\/aspect>/g;
	let match = regex.exec(text);

	while (match !== null) {
		// Add text before this aspect
		if (match.index > lastEnd) {
			parts.push(text.slice(lastEnd, match.index));
		}

		const aspectText = match[1];
		const aspectIndex = currentIndex;
		const isChecked = relicAspects[aspectIndex] === 1;

		parts.push(
			<AspectSpan
				key={`aspect-${aspectIndex}`}
				text={aspectText}
				checked={isChecked}
				editable={editable}
				onToggle={() => onToggle(aspectIndex)}
			/>,
		);

		currentIndex++;
		lastEnd = match.index + match[0].length;
		match = regex.exec(text);
	}

	// Add remaining text after last aspect
	if (lastEnd < text.length) {
		parts.push(text.slice(lastEnd));
	}

	return { elements: parts, nextAspectIndex: currentIndex };
}

function AspectSpan({
	text,
	checked,
	editable,
	onToggle,
}: {
	text: string;
	checked: boolean;
	editable: boolean;
	onToggle: () => void;
}) {
	return (
		<span>
			<button
				type="button"
				onClick={onToggle}
				disabled={!editable}
				className={`inline-block align-middle w-3 h-3 border rounded-sm text-[8px] leading-[0.6rem] text-center mr-0.5 ${
					checked
						? "bg-theme-accent-primary border-theme-accent-primary text-white"
						: "border-theme-border-accent bg-transparent"
				} ${editable ? "cursor-pointer hover:border-theme-accent-primary" : "cursor-default opacity-70"}`}
				aria-label={checked ? "Uncheck aspect" : "Check aspect"}
			>
				{checked && "✓"}
			</button>
			<strong
				className={`${checked ? "line-through opacity-60" : ""} text-theme-text-accent`}
			>
				{text}
			</strong>
		</span>
	);
}

function EditableLine({
	relic,
}: {
	relic: { title: string; text: string; extraLines: number };
}) {
	const [showEdit, setShowEdit] = useState(false);
	const {
		updateGameState,
		gameState,
		user: { id },
	} = useGame();
	const character = gameState.players.find(
		(player) => player.id === id,
	)?.character;

	const onSave = (value: string) => {
		if (!character) return;
		const newRelicText = `${relic.text}\n<aspect>${value}</aspect>`;
		const newRelics = character.relics.map((rel) =>
			rel.title === relic.title
				? {
						...rel,
						text: newRelicText,
						extraLines: relic.extraLines - 1,
					}
				: rel,
		);
		updateGameState({
			players: gameState.players.map((player) =>
				player.character && player.id === id
					? { ...player, character: { ...player.character, relics: newRelics } }
					: player,
			),
		});
		setShowEdit(false);
	};

	return (
		<div className="flex gap-2 items-center">
			{showEdit ? (
				<ConditionInput
					condition={""}
					placeholder={`Add aspect...`}
					onSave={onSave}
				/>
			) : (
				<div className="flex-grow w-full flex gap-2 items-center ">
					<BlankCondition />
				</div>
			)}
			<PencilIconButton
				isEditing={showEdit}
				setIsEditing={() => setShowEdit(!showEdit)}
			/>
		</div>
	);
}
