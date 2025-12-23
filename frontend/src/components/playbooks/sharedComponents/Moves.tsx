import { useCallback, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { playbookBases } from "../content";
import { coreMoves } from "../coreMoves";
import type { Character } from "../types";
import { parseRelicText } from "../utils";

export function Moves({ character }: { character: Character }) {
	const coreMove = coreMoves(character)[character.playbook];
	const otherMoves = character.moves ? character.moves : [];

	return (
		<div className="text-sm">
			{coreMove}
			<div className="h-6" />
			{otherMoves.length > 0 &&
				otherMoves.map((move) => {
					return (
						<MoveDisplay key={move.title} character={character} move={move} />
					);
				})}
		</div>
	);
}

function MoveDisplay({
	character,
	move,
}: {
	character: Character;
	move: Character["moves"][number];
}) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const stateMove = gameState.players
		.find((p) => p.id === character.playerId && p.character)
		?.character?.moves.find((m) => m.title === move.title);
	const contentDef = playbookBases[character.playbook].moves.find(
		(m) => m.title === move.title,
	);
	const content = stateMove?.text ? stateMove.text : contentDef?.text;

	// Count aspects in the content by joining and parsing
	const fullText = content?.join("\n") ?? "";
	const aspectCount = (fullText.match(/<aspect>/g) || []).length;

	// Checkboxes come after aspects in the checks array
	const checkboxCount = stateMove?.checks?.length ?? 0;

	const toggleCheck = useCallback(
		(index: number) => {
			if (!editable) return;

			const currentChecks = move.checks ?? [];
			const newChecks = [...currentChecks];
			// Ensure array is long enough
			while (newChecks.length <= index) {
				newChecks.push(0);
			}
			newChecks[index] = newChecks[index] === 1 ? 0 : 1;

			updateGameState({
				players: gameState.players.map((player) =>
					player.id === id
						? {
								...player,
								character: player.character
									? {
											...player.character,
											moves: player.character.moves.map((m) =>
												m.title === move.title
													? { ...m, checks: newChecks }
													: m,
											),
										}
									: null,
							}
						: player,
				),
			});
		},
		[editable, move, updateGameState, gameState.players, id],
	);

	const syncLines = () => {
		if (!editable || !localLines) return;
		const newLines = [...localLines];
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === id && player.character
					? {
							...player,
							character: {
								...player.character,
								moves: player.character.moves.map((m) =>
									m.title === move.title ? { ...m, lines: newLines } : m,
								),
							},
						}
					: player,
			),
		});
	};

	const [localLines, setLocalLines] = useState(move.lines);
	const updateLineLocal = (index: number, line: string) => {
		if (!localLines) return;
		const newLines = [...localLines];
		newLines[index] = line;
		setLocalLines(newLines);
	};

	// Track aspect index across all lines
	let globalAspectIndex = 0;

	return (
		<div className="flex flex-col justify-center gap-1">
			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				{move.title}
			</h3>
			{content &&
				content.length > 0 &&
				content.map((line, lineIndex) => {
					const parsed = parseRelicText(
						line,
						move.checks ?? [],
						globalAspectIndex,
						editable,
						toggleCheck,
					);
					globalAspectIndex = parsed.nextAspectIndex;

					return (
						<p
							className="text-left leading-relaxed"
							key={`${move.title}-line-${lineIndex}`}
						>
							{parsed.elements}
						</p>
					);
				})}

			{/* Checkboxes row - rendered after aspects */}
			{checkboxCount > 0 && (
				<div className="w-full flex justify-center items-center gap-2">
					{Array.from({ length: checkboxCount }).map((_, idx) => {
						const checkIndex = aspectCount + idx;
						const isChecked = (move.checks ?? [])[checkIndex] === 1;
						return (
							<button
								key={`${move.title}-checkbox-${checkIndex}`}
								type="button"
								onClick={() => toggleCheck(checkIndex)}
								disabled={!editable}
								className={`w-4 h-4 border rounded text-[10px] leading-[0.75rem] text-center ${
									isChecked
										? "bg-theme-accent-primary border-theme-accent-primary text-white"
										: "border-theme-border-accent bg-transparent"
								} ${editable ? "cursor-pointer hover:border-theme-accent-primary" : "cursor-default opacity-70"}`}
								aria-label={isChecked ? "Uncheck" : "Check"}
							>
								{isChecked && "✓"}
							</button>
						);
					})}
				</div>
			)}

			<div className="h-6" />
			{move.lines &&
				move.lines.length > 0 &&
				move.lines.map((line, lineIndex) => {
					return editable ? (
						<input
							type="text"
							key={`${move.title}-line-${lineIndex}-${line}`}
							value={localLines?.[lineIndex] ?? ""}
							disabled={!editable}
							onChange={(e) => updateLineLocal(lineIndex, e.target.value)}
							onBlur={syncLines}
							className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
						/>
					) : (
						<p
							key={`${move.title}-line-${lineIndex}-${line}`}
							className="text-left leading-relaxed"
						>
							◆ {line}
						</p>
					);
				})}
		</div>
	);
}
