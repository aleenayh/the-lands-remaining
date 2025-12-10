import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";

export function ExperienceTracker({ character }: { character: Character }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const experience =
		gameState.players.find((player) => player.id === character.playerId)
			?.character?.experience ?? 0;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-center gap-2 text-lg text-theme-text-primary items-center">
				<h3 className="text-md font-bold text-theme-text-accent">
					Experience:
				</h3>
				{Array.from({ length: 6 }).map((_, index) => {
					return (
						<input
							type="checkbox"
							key={`experience-tracker-${
								// biome-ignore lint/suspicious/noArrayIndexKey: just boxes
								index
							}`}
							checked={experience >= index + 1}
							disabled={!editable}
							onChange={(e) => {
								updateGameState({
									players: gameState.players.map((player) =>
										player.id === character.playerId
											? {
													...player,
													character: player.character
														? {
																...player.character,
																experience: e.target.checked ? index + 1 : 0,
															}
														: null,
												}
											: player,
									),
								});
							}}
						/>
					);
				})}
			</div>
			<div className="flex justify-center gap-2 text-lg text-theme-text-primary items-center">
				<h3 className="text-md font-bold text-theme-text-accent">Ritual:</h3>
				<p className="text-md text-theme-text-primary">{character.ritual}</p>
			</div>
		</div>
	);
}
