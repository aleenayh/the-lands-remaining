import { Dialog } from "radix-ui";
import { useCallback, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { AddRelicForm } from "../advancement/RewardModal";
import { constructAspectArray } from "../creation/CharacterCreateForm";
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

			let currentAspects = character.relicAspects;
			//should never be empty; this means we failed zod validation and need to reconstruct before mutation
			if (currentAspects.length === 0) {
				currentAspects = constructAspectArray(character.relics);
			}

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
		<Dialog.Root>
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
				<Dialog.Trigger asChild>
					<button
						type="button"
						className={`mx-auto w-1/2 h-10 bg-theme-bg-accent text-theme-text-primary rounded-md hover:bg-theme-bg-accent-hover hover:text-theme-text-primary-hover transition-colors ${!editable && "hidden"}`}
						disabled={!editable}
					>
						Manage Equipment
					</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="DialogOverlay" />
					<Dialog.Content className="DialogContent">
						<Dialog.Close asChild>
							<button
								type="button"
								className="absolute top-2 right-2 aspect-square w-8 h-8 bg-theme-bg-accent text-theme-text-primary rounded-full flex justify-center items-center"
							>
								X
							</button>
						</Dialog.Close>
						<Dialog.Title className="DialogTitle">
							Manage Equipment
						</Dialog.Title>
						<Dialog.Description className="DialogDescription">
							Add or remove relics and equipment.
						</Dialog.Description>
						<EquipmentManagementForm character={character} />
					</Dialog.Content>
				</Dialog.Portal>
			</div>
		</Dialog.Root>
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

function EquipmentManagementForm({ character }: { character: Character }) {
	const { gameState, updateGameState } = useGame();
	const currentRelics = character.relics;

	const handleRemoveRelic = (title: string) => {
		const newRelics = currentRelics.filter((r) => r.title !== title);
		updateGameState({
			players: gameState.players.map((player) =>
				player.character && player.id === character.playerId
					? {
							...player,
							character: { ...player.character, relics: newRelics },
						}
					: player,
			),
		});
	};

	return (
		<div className="flex flex-col gap-2 justify-center items-center w-full">
			<h3 className="text-lg font-bold text-theme-text-accent">
				Current Items
			</h3>
			{currentRelics.map((relic) => (
				<div
					key={relic.title}
					className="flex flex-col gap-1 justify-center items-center w-full"
				>
					<h4 className="text-sm font-bold text-theme-text-accent text-center">
						{relic.title}
					</h4>
					<p className="text-xs text-theme-text-primary">
						{
							parseRelicText(
								relic.text,
								character.relicAspects,
								0,
								false,
								() => {},
							).elements
						}
					</p>
					<button
						type="button"
						className="mx-auto bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
						onClick={() => handleRemoveRelic(relic.title)}
					>
						Remove {relic.title}
					</button>
				</div>
			))}
			<div className="h-12" />
			<h3 className="text-lg font-bold text-theme-text-accent">Add an Item</h3>
			<AddRelicForm onClose={() => {}} />
		</div>
	);
}
