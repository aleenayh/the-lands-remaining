import { useCallback } from "react";
import { useGame } from "../../../context/GameContext";
import { playbookBases } from "../content";
import type { Character } from "../types";

export function Questions({ character }: { character: Character }) {
	const {
		updateGameState,
		gameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const { questions } = playbookBases[character.playbook];
	const markedQuestions = character.questions;

	const onToggle = useCallback(
		(checked: boolean, key: number) => {
			updateGameState({
				players: gameState.players.map((player) =>
					player.id === character.playerId && player.character
						? {
								...player,
								character: {
									...player.character,
									questions: { ...player.character.questions, [key]: checked },
								},
							}
						: player,
				),
			});
		},
		[updateGameState, gameState.players, character.playerId],
	);
	if (!questions.length) return null;

	return (
		<div className="w-full flex flex-col gap-2">
			{editable && (
				<div className="text-sm italic text-theme-text-secondary">
					The first two are always marked. Choose two more to mark.
				</div>
			)}
			<div className="flex items-center gap-2 text-left">
				<input type="checkbox" checked={true} disabled={true} />
				<label className="text-sm" htmlFor="did-the-embers-resolve-a-mystery">
					<span className={`text-theme-text-primary font-bold`}>
						Did the Embers resolve a Mystery?
					</span>
				</label>
			</div>
			<div className="flex items-center gap-2 text-left">
				<input type="checkbox" checked={true} disabled={true} />
				<label className="text-sm" htmlFor="did-you-roll-with-cinder">
					<span className={`text-theme-text-primary font-bold`}>
						Did you roll with Cinder?
					</span>
				</label>
			</div>
			{Object.entries(questions).map(([key, value]) => {
				const marked = markedQuestions[parseInt(key, 10)] === true;
				return (
					<div
						key={`question-${key}`}
						className="flex items-center gap-2 text-left"
					>
						<input
							type="checkbox"
							checked={marked}
							disabled={!editable}
							onChange={(e) => onToggle(e.target.checked, parseInt(key, 10))}
						/>
						<label className="text-sm" htmlFor={value}>
							<span
								className={`${marked ? "text-theme-text-primary font-bold" : "text-theme-text-muted"}`}
							>
								{value}
							</span>
						</label>
					</div>
				);
			})}
		</div>
	);
}
