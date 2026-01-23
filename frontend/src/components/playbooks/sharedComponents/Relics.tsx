import { Dialog } from "radix-ui";
import { useState } from "react";
import { useGame } from "../../../context/GameContext";
import { EditableLine } from "../../shared/EditableLine";
import { AddRelicForm } from "../advancement/RewardModal";
import { constructAspectArray } from "../creation/CharacterCreateForm";
import type { Character } from "../types";
import { parseRelicText } from "../utils";

export function Relics({ character }: { character: Character }) {
	const {
		updateGameState,
		gameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;

	const toggleAspect = (title: string, aspectIndex: number) => {
		if (!editable) return;

		let currentAspects =
			character.relics.find((r) => r.title === title)?.aspects ?? [];
		//should never be empty; this means we failed zod validation and need to reconstruct before mutation
		if (currentAspects.length === 0) {
			currentAspects = constructAspectArray(
				character.relics.filter((r) => r.title === title),
			);
		}

		const newAspects = [...currentAspects];
		newAspects[aspectIndex] = newAspects[aspectIndex] === 1 ? 0 : 1;

		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: player.character
								? {
										...player.character,
										relics: player.character.relics.map((r) =>
											r.title === title ? { ...r, aspects: newAspects } : r,
										),
									}
								: null,
						}
					: player,
			),
		});
	};

	return (
		<Dialog.Root>
			<div className="flex flex-col gap-3 w-full">
				<h3 className="text-lg font-bold text-theme-text-accent">Relics</h3>
				{character.relics
					.filter((relic) => relic.type === "relic")
					.map((relic) => {
						const canEdit = editable && !relic.atAlcove;
						const parsed = parseRelicText(
							relic.text,
							relic.aspects ?? [],
							canEdit,
							(index) => toggleAspect(relic.title, index),
						);

						return (
							<div key={relic.title} className="flex flex-col gap-1 text-left">
								<h3 className="text-sm font-bold text-theme-text-accent text-center">
									{relic.title}
								</h3>
								{relic.atAlcove && (
									<p className="text-sm text-theme-text-accent text-center">
										This item is in your Alcove at the Mourning Tower.
									</p>
								)}
								<p
									className={`text-sm leading-relaxed ${relic.atAlcove ? "opacity-60 text-theme-text-muted" : ""}`}
								>
									{parsed}
								</p>
								{editable &&
									relic.extraLines > 0 &&
									Array.from({ length: relic.extraLines }).map((_, index) => (
										<EditableLineWrapper
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
				<h3 className="text-lg font-bold text-theme-text-accent">Equipment</h3>
				{character.relics
					.filter((relic) => relic.type === "equipment")
					.map((relic) => {
						const parsed = parseRelicText(
							relic.text,
							relic.aspects ?? [],
							editable,
							(index) => toggleAspect(relic.title, index),
						);

						return (
							<div key={relic.title} className="flex flex-col gap-1 text-left">
								<h3 className="text-sm font-bold text-theme-text-accent text-center">
									{relic.title}
								</h3>
								<p className="text-sm leading-relaxed">{parsed}</p>
								{editable &&
									relic.extraLines > 0 &&
									Array.from({ length: relic.extraLines }).map((_, index) => (
										<EditableLineWrapper
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
						<Dialog.Description className="DialogDescription hidden">
							Add or remove relics and equipment.
						</Dialog.Description>
						<EquipmentManagementForm character={character} />
					</Dialog.Content>
				</Dialog.Portal>
			</div>
		</Dialog.Root>
	);
}

function EditableLineWrapper({
	relic,
}: {
	relic: { title: string; text: string; extraLines: number };
}) {
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
	};

	return (
		<EditableLine
			text={""}
			editable={true}
			onSave={(_, value) => onSave(value)}
			index={0}
		/>
	);
}

function EquipmentManagementForm({ character }: { character: Character }) {
	const { gameState, updateGameState } = useGame();
	const [step, setStep] = useState<"view-remove" | "add-relic">("view-remove");
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
			{step === "view-remove" && (
				<div className="flex flex-col gap-2 justify-center items-center w-full pb-10">
					<button
						type="button"
						onClick={() => setStep("add-relic")}
						className="self-end text-sm text-theme-text-secondary bg-theme-bg-secondary rounded-md px-2 py-1 hover:text-theme-text-primary hover:bg-theme-bg-accent mb-2 shrink-0 border border-theme-border-accent"
					>
						Add an Item →
					</button>
					<h3 className="text-lg font-bold text-theme-text-accent">Relics</h3>
					{currentRelics
						.filter((relic) => relic.type === "relic")
						.map((relic) => (
							<div
								key={relic.title}
								className="flex flex-col gap-1 justify-center items-center w-full"
							>
								<h4 className="text-sm font-bold text-theme-text-accent text-center">
									{relic.title}
								</h4>
								<p className="text-xs text-theme-text-primary">
									{parseRelicText(relic.text, relic.aspects, false, () => {})}
								</p>
							</div>
						))}
					<div className="my-4 h-[0.25rem] bg-theme-bg-accent w-full" />
					<h3 className="text-lg font-bold text-theme-text-accent">
						Equipment
					</h3>
					{currentRelics
						.filter((relic) => relic.type === "equipment")
						.map((relic) => (
							<div
								key={relic.title}
								className="flex flex-col gap-1 justify-center items-center w-full"
							>
								<div className="flex flex-col md:flex-row gap-2 justify-center items-center w-full">
									<h4 className="text-sm font-bold text-theme-text-accent text-center">
										{relic.title}
									</h4>
									<button
										type="button"
										className="border border-theme-border-accent px-2 bg-theme-bg-accent text-theme-text-primary rounded-md hover:bg-theme-bg-primary hover:text-theme-text-accent"
										onClick={() => handleRemoveRelic(relic.title)}
									>
										Remove
									</button>
								</div>
								<p className="text-xs text-theme-text-primary text-left">
									{parseRelicText(relic.text, relic.aspects, false, () => {})}
								</p>
							</div>
						))}
				</div>
			)}

			{step === "add-relic" && (
				<div className="flex flex-col gap-2 justify-center items-center w-full">
					<h3 className="text-lg font-bold text-theme-text-accent">
						Add an Item
					</h3>
					<button
						type="button"
						onClick={() => setStep("view-remove")}
						className="self-start text-sm text-theme-text-secondary bg-theme-bg-secondary rounded-md px-2 py-1 hover:text-theme-text-primary hover:bg-theme-bg-accent mb-2 shrink-0 border border-theme-border-accent"
					>
						← Back to Equipment
					</button>
					<AddRelicForm onClose={() => {}} />
				</div>
			)}
		</div>
	);
}
