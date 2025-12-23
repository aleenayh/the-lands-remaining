import { useCallback } from "react";
import { useGame } from "../../../context/GameContext";
import { playbookBases } from "../content";
import type { Character, fireToComeKey, playbookKey } from "../types";

export function Fires({ character }: { character: Character }) {
	const {
		updateGameState,
		gameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;

	const kindlingGateDisabled = gameState.players.some(
		(player) =>
			player.id !== character.playerId &&
			player.character?.fireToCome["The Kindling Gate"] === true,
	);

	const onToggleOldFire = useCallback(
		(checked: boolean) => {
			updateGameState({
				players: gameState.players.map((player) =>
					player.id === character.playerId && player.character
						? {
								...player,
								character: {
									...player.character,
									oldFire: checked
										? character.oldFire + 1
										: character.oldFire - 1,
								},
							}
						: player,
				),
			});
		},
		[updateGameState, gameState.players, character],
	);

	const onToggleFireToCome = useCallback(
		(checked: boolean, key: fireToComeKey) => {
			updateGameState({
				players: gameState.players.map((player) =>
					player.id === character.playerId
						? {
								...player,
								character: {
									...character,
									fireToCome: { ...character.fireToCome, [key]: checked },
								},
							}
						: player,
				),
			});
		},
		[updateGameState, gameState.players, character],
	);

	const { fireToCome, oldFire } =
		playbookBases[character.playbook as playbookKey];
	const markedOldFire = character.oldFire;

	return (
		<div className="flex gap-4">
			<div className="w-1/2 flex flex-col gap-2">
				<h3 className="text-sm font-bold text-theme-text-accent text-center">
					The Old Fire
				</h3>
				{editable && (
					<p className="text-xs italic text-theme-text-muted">
						Mark the first unmarked box.
					</p>
				)}
				<div
					className={`${editable ? "flex flex-col" : "flex flex-row gap-x-0 gap-y-2 justify-start flex-wrap"}`}
				>
					{oldFire.map((fire, i) => {
						const marked = markedOldFire >= i + 1; //zero indexed
						return (
							<div key={fire} className="flex items-start gap-2 text-left">
								<input
									type="checkbox"
									checked={marked}
									disabled={!editable}
									onChange={(e) => onToggleOldFire(e.target.checked)}
								/>
								<label className="text-xs" htmlFor={fire}>
									{editable && (
										<span
											className={`${marked ? "text-theme-text-muted line-through" : ""}`}
										>
											{fire}
										</span>
									)}
								</label>
							</div>
						);
					})}
				</div>
			</div>
			<div className="w-1/2 flex flex-col gap-2">
				<h3 className="text-sm font-bold text-theme-text-accent text-center">
					The Fire to Come
				</h3>

				{editable && (
					<p className="text-xs italic text-theme-text-muted">
						If no boxes are marked, you may retire this character to obscurity.
						Otherwise, mark any box you wish.
					</p>
				)}
				{Object.entries(fireToCome).map(([key, fire]) => {
					const marked = character.fireToCome[key as fireToComeKey];
					const disabled = kindlingGateDisabled && key === "The Kindling Gate";
					return (
						<div key={fire} className="flex items-start gap-2 text-left">
							<input
								id={`fire-fire-${fire}`}
								type="checkbox"
								checked={marked}
								disabled={!editable || disabled}
								onChange={(e) =>
									onToggleFireToCome(e.target.checked, key as fireToComeKey)
								}
							/>
							<label className="text-xs" htmlFor={`fire-fire-${fire}`}>
								<strong
									className={`${marked || disabled ? "text-theme-text-muted line-through" : ""}`}
								>
									{key}
								</strong>
								{editable ? ": " : " "}
								{editable && (
									<span
										className={`${marked || disabled ? "text-theme-text-muted line-through" : ""}`}
									>
										{fire}
									</span>
								)}
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}
