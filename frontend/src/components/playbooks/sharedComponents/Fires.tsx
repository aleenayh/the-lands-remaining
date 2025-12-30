import { useCallback } from "react";
import { useGame } from "../../../context/GameContext";
import { customFieldOrFallback, playbookBases } from "../content";
import {
	type Character,
	type fireToComeKey,
	type playbookKey,
	playbookKeys,
} from "../types";

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
		(checked: boolean, index: number) => {
			const newOldFire = { ...character.oldFire, [String(index)]: checked };
			updateGameState({
				players: gameState.players.map((player) =>
					player.id === character.playerId && player.character
						? {
								...player,
								character: {
									...player.character,
									oldFire: newOldFire,
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
		character.playbook === playbookKeys.custom
			? {
					fireToCome: customFieldOrFallback(character, "fireToComeDefinitions")
						.value as Record<fireToComeKey, string>,
					oldFire: customFieldOrFallback(character, "oldFireDefinitions")
						.value as string[],
				}
			: playbookBases[character.playbook as playbookKey];
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
						return (
							<div key={fire} className="flex items-start gap-2 text-left">
								<input
									type="checkbox"
									checked={markedOldFire[i]}
									disabled={!editable}
									onChange={(e) => onToggleOldFire(e.target.checked, i)}
								/>
								<label className="text-xs" htmlFor={fire}>
									{editable && (
										<span
											className={`${markedOldFire[i] ? "text-theme-text-muted line-through" : ""}`}
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
					const showTroubadourBoxes =
						key === "The Tinder Arch" &&
						character.playbook === playbookKeys.howlingTroubadour;
					return (
						<div key={fire} className="flex items-start gap-2 text-left">
							<input
								id={`fire-fire-${fire}`}
								type="checkbox"
								checked={marked}
								disabled={!editable}
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
								{showTroubadourBoxes && (
									<HowlingTroubadourBoxes character={character} />
								)}
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}

const HowlingTroubadourBoxes = ({ character }: { character: Character }) => {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable =
		id === character.playerId &&
		character.fireToCome["The Tinder Arch"] === true;

	const onToggle = (checked: boolean) => {
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: {
								...character,
								coreMoveState: {
									...character.coreMoveState,
									tinderBoxes: checked ? tinderBoxes + 1 : tinderBoxes - 1,
								},
							},
						}
					: player,
			),
		});
	};

	if (character.coreMoveState.type !== "howling-troubadour") return null;
	const { tinderBoxes } = character.coreMoveState;
	return (
		<div className="flex flex-col items-center justify-center gap-2 text-left">
			<div className="flex justify-center items-center gap-2">
				{Array.from({ length: 3 }).map((_, index) => {
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: just boxes
						<div key={index} className="flex items-start gap-2 text-left">
							<input
								type="checkbox"
								checked={tinderBoxes > index}
								disabled={!editable}
								onChange={(e) => onToggle(e.target.checked)}
							/>
						</div>
					);
				})}
			</div>
			<p>
				When all three boxes are marked, tell the Keeper they can now force you
				and all other Embers—no matter where they are—into a struggle with Sun
				Mask as a reaction.
			</p>
		</div>
	);
};
