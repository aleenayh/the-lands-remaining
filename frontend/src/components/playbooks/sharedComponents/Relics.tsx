import { useCallback, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { PencilIconButton } from "../creation/PencilIconButton";
import type { Character } from "../types";
import { parseRelicText } from "../utils";
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
					<div key={relic.title} className="flex flex-col gap-1 text-left">
						<h3 className="text-sm font-bold text-theme-text-accent text-center">
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
				<div className="flex-grow w-[70%] md:w-full">
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
