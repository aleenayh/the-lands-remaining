import { useCallback } from "react";
import { useGame } from "../../../context/GameContext";
import { playbookBases } from "../content";
import type { Character } from "../types";
import { Section } from "./Section";

export function Cinders({ character }: { character: Character }) {
	const {
		updateGameState,
		gameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const { cinders } = playbookBases[character.playbook];
	const markedCinders = character.cinders;

	const onToggle = useCallback(
		(checked: boolean, key: number) => {
			updateGameState({
				players: gameState.players.map((player) =>
					player.id === character.playerId && player.character
						? {
								...player,
								character: {
									...player.character,
									cinders: { ...player.character.cinders, [key]: checked },
								},
							}
						: player,
				),
			});
		},
		[updateGameState, gameState.players, character.playerId],
	);

	return (
		<div className="w-full flex flex-col gap-2">
			<h3 className="text-xl font-bold text-theme-text-accent">Cinders</h3>
			{Object.entries(cinders).map(([key, value]) => {
				const marked = markedCinders[parseInt(key, 10)] === true;
				return (
					<div
						key={`cinder-${key}`}
						className="flex items-start gap-2 text-left"
					>
						<input
							type="checkbox"
							checked={marked}
							disabled={!editable}
							onChange={(e) => onToggle(e.target.checked, parseInt(key, 10))}
						/>
						<label className="text-sm" htmlFor={value}>
							<span
								className={`${marked ? "text-theme-text-muted line-through" : ""}`}
							>
								{value}
							</span>
						</label>
					</div>
				);
			})}
			<Section title="The Kindling Gate" collapsible={true} minify>
				<div className="text-sm italic text-theme-text-secondary">
					If you have marked The Kindling Gate, track effects below.
				</div>
				<div className="flex gap-2 justify-center items-center">
					{Array.from({ length: 6 }).map((_, index) => {
						return (
							<input
								type="checkbox"
								key={`kindling-gate-tracker-${
									// biome-ignore lint/suspicious/noArrayIndexKey: just boxes
									index
								}`}
								checked={markedCinders[index + 6] === true}
								onChange={(e) => onToggle(e.target.checked, index + 6)}
							/>
						);
					})}
				</div>
				<div className="text-sm text-theme-text-primary text-left">
					Whenever you act in accordance with—or are negatively affected by—the
					Herald Condition, mark a box. When all the boxes are marked, you can
					unmark them to unmark the Cinder. The Herald Condition cannot be
					cleared in the normal ways, but you can choose to clear it in order to
					get an automatic 12+ on a roll. If you do this, cross out The Kindling
					Gate and no longer mark these boxes.
				</div>
			</Section>
		</div>
	);
}
