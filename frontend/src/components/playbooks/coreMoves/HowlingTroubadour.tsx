import { Dialog } from "radix-ui";
import { useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";
import { ReactComponent as Elcyene } from "./moon/elcyene.svg";
import { ReactComponent as Rhagar } from "./moon/rhagar.svg";

export const moonStartPosition = 3;

export function CoreMoveHowlingTroubadour({
	character,
}: {
	character: Character;
}) {
	const { coreMoveState } = character;

	if (coreMoveState.type !== "howling-troubadour") return null;

	return (
		<div className="flex flex-col gap-2 text-left">
			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				Under Two Moons…
			</h3>
			<p>
				The twin moons, Red Rhagar and Blue Elcyene, are the watchful eyes of
				the Wolf-King. He dwells in one or the other depending on his shifting
				nature. When fury claims him, he stalks the heavens from Red Rhagar, his
				gaze hot, hunting for the perfect moment to strike. When his spirit is
				calmed, he resides within Blue Elcyene, watching the world with a cool,
				lupine protectiveness.
			</p>
			<p className="inline">
				{" "}
				You carry a sliver of lunar power in your voice, and the gravity of each
				moon tugs at your moods, your magic, and your fate. When the Keeper asks
				or when a move instructs you, move the marker toward{" "}
				<Rhagar className="inline h-4 w-4" /> Red Rhagar or{" "}
				<Elcyene className="inline h-4 w-4" /> Blue Elcyene.{" "}
			</p>

			<MoonTracker character={character} />

			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				…In Service of the Wolf King…
			</h3>
			<p>
				At the beginning of each session, the Keeper will narrate a whisper you
				hear on the wind from the Wolf-King, asking you to do a particular task,
				seemingly unrelated to the situation at hand. The tasks will get
				increasingly strange and disturbing the more marks you have on The Fire
				to Come. If you complete this task in the same session it is assigned,
				mark XP and move the marker in the direction of whichever moon the
				Keeper says.{" "}
			</p>
		</div>
	);
}

function MoonTracker({ character }: { character: Character }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;

	const onToggle = useCallback(
		(index: number) => {
			updateGameState({
				players: gameState.players.map((player) =>
					player.id === id
						? {
								...player,
								character: {
									...character,
									coreMoveState: {
										...character.coreMoveState,
										moonPosition: index,
									},
								},
							}
						: player,
				),
			});
		},
		[character, updateGameState, gameState.players, id],
	);
	if (character.coreMoveState.type !== "howling-troubadour") return null;
	const position = character.coreMoveState.moonPosition;
	const conditionsFull = !character.conditions.some(
		(condition) => condition === "",
	);
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-center gap-2">
				<Rhagar className="inline h-4 w-4" />
				{Array.from({ length: 7 }).map((_, index) => (
					<input
						type="checkbox"
						checked={index === position}
						disabled={!editable}
						onChange={() => onToggle(index)}
						key={`moonbox-${
							// biome-ignore lint/suspicious/noArrayIndexKey: decorative
							index
						}`}
						className={`${index === position ? "text-theme-text-accent" : "text-theme-text-primary"} w-4 h-4`}
					/>
				))}
				<Elcyene className="inline h-4 w-4 " />
			</div>
			<div className="flex flex-col w-full justify-center">
				{position === 0 && editable && (
					<RhagarModal disabled={conditionsFull} character={character} />
				)}
				{position === 6 && editable && (
					<ElcyeneModal disabled={conditionsFull} character={character} />
				)}
				{(position === 0 || position === 6) && editable && conditionsFull && (
					<p className="py-2 font-bold text-theme-text-accent text-center">
						You have three active conditions and must take the{" "}
						{position === 0 ? "Ferocious" : "Restrained"} condition. Immediately
						stoke the fire to clear an existing condition, then return to take
						your new condition.
					</p>
				)}
			</div>
		</div>
	);
}

function RhagarModal({
	disabled,
	character,
}: {
	disabled: boolean;
	character: Character;
}) {
	const { gameState, updateGameState } = useGame();
	const { register, handleSubmit } = useForm<{
		"decrease-composure-checkbox": boolean;
		"decrease-reason-checkbox": boolean;
		"unmark-tinder-arch-checkbox": boolean;
		"unmark-aspects-weapon-checkbox": boolean;
	}>({
		defaultValues: {
			"decrease-composure-checkbox": false,
			"decrease-reason-checkbox": false,
			"unmark-tinder-arch-checkbox": false,
			"unmark-aspects-weapon-checkbox": false,
		},
	});

	const onSubmit = (data: {
		"decrease-composure-checkbox": boolean;
		"decrease-reason-checkbox": boolean;
		"unmark-tinder-arch-checkbox": boolean;
		"unmark-aspects-weapon-checkbox": boolean;
	}) => {
		const conditions = character.conditions;
		const emptyConditionIndex = conditions.indexOf("");
		if (emptyConditionIndex === -1) {
			toast.error("Something went wrong! No empty condition found.");
			console.error("No empty condition found");
			return;
		}
		conditions[emptyConditionIndex] = "Ferocious";
		let newAbilities = character.abilities;
		if (data["decrease-composure-checkbox"]) {
			newAbilities = {
				...character.abilities,
				composure: character.abilities.composure - 1,
				vitality: Math.min(4, character.abilities.vitality + 1),
			};
		}
		if (data["decrease-reason-checkbox"]) {
			newAbilities = {
				...newAbilities,
				reason: character.abilities.reason - 1,
				presence: Math.min(4, character.abilities.presence + 1),
			};
		}
		const newFires = character.fireToCome;
		if (data["unmark-tinder-arch-checkbox"]) {
			newFires["The Tinder Arch"] = false;
		}
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: {
								...character,
								conditions,
								abilities: newAbilities,
								fireToCome: newFires,
								coreMoveState: {
									...character.coreMoveState,
									moonPosition: moonStartPosition,
								},
							},
						}
					: player,
			),
		});
	};

	return (
		<Dialog.Root>
			<Dialog.Trigger
				disabled={disabled}
				className={`bg-theme-bg-secondary text-md hover:bg-theme-bg-accent hover:text-theme-text-accent text-theme-text-primary rounded-lg p-2`}
			>
				Become Ferocious
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
					<Dialog.Title className="DialogTitle">Become Ferocious</Dialog.Title>
					<Dialog.Description className="DialogDescription">
						Take the condition: Ferocious, and choose three of the following:
					</Dialog.Description>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-2 text-sm"
					>
						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								id={useId()}
								{...register("decrease-composure-checkbox")}
							/>
							<label htmlFor="decrease-composure-checkbox">
								Decrease Composure by 1 (to {character.abilities.composure - 1})
								{character.abilities.vitality >= 4
									? ". Your Vitality cannot be increased any further"
									: ` and increase Vitality by 1 (to ${Math.min(4, character.abilities.vitality + 1)})`}
								.
							</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								id={useId()}
								{...register("decrease-reason-checkbox")}
							/>
							<label htmlFor="decrease-reason-checkbox">
								Decrease Reason by 1 (to {character.abilities.reason - 1})
								{character.abilities.presence >= 4
									? ". Your Presence cannot be increased any further"
									: ` and increase Presence by 1 (to ${Math.min(4, character.abilities.presence + 1)})`}
								.
							</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								id={useId()}
								disabled={!character.fireToCome["The Tinder Arch"]}
								{...register("unmark-tinder-arch-checkbox")}
							/>
							<label htmlFor="unmark-tinder-arch-checkbox">
								{character.fireToCome["The Tinder Arch"]
									? "Unmark The Tinder Arch"
									: "Unmark The Tinder Arch (no effect; not yet marked)"}
							</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								id={useId()}
								{...register("unmark-aspects-weapon-checkbox")}
							/>
							<label htmlFor="unmark-aspects-weapon-checkbox">
								Unmark all Aspects on a Relic or piece of Equipment that is a
								weapon. (Manually after submitting).
							</label>
						</div>
						<div className="flex justify-center">
							<button
								type="submit"
								className="mx-auto bg-theme-bg-accent text-theme-text-primary rounded-lg p-2 hover:bg-theme-bg-accent hover:text-theme-text-accent"
							>
								Confirm
							</button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function ElcyeneModal({
	disabled,
	character,
}: {
	disabled: boolean;
	character: Character;
}) {
	const { gameState, updateGameState } = useGame();
	const { register, handleSubmit } = useForm<{
		"decrease-vitality-checkbox": boolean;
		"decrease-presence-checkbox": boolean;
		"unmark-old-fire-checkbox": boolean;
		"unmark-aspects-checkbox": boolean;
	}>({
		defaultValues: {
			"decrease-vitality-checkbox": false,
			"decrease-presence-checkbox": false,
			"unmark-old-fire-checkbox": false,
			"unmark-aspects-checkbox": false,
		},
	});

	const onSubmit = (data: {
		"decrease-vitality-checkbox": boolean;
		"decrease-presence-checkbox": boolean;
		"unmark-old-fire-checkbox": boolean;
		"unmark-aspects-checkbox": boolean;
	}) => {
		const conditions = character.conditions;
		const emptyConditionIndex = conditions.indexOf("");
		if (emptyConditionIndex === -1) {
			toast.error("Something went wrong! No empty condition found.");
			console.error("No empty condition found");
			return;
		}
		conditions[emptyConditionIndex] = "Restrained";
		let newAbilities = character.abilities;
		if (data["decrease-vitality-checkbox"]) {
			newAbilities = {
				...character.abilities,
				vitality: character.abilities.vitality - 1,
				composure: Math.min(4, character.abilities.composure + 1),
			};
		}
		if (data["decrease-presence-checkbox"]) {
			newAbilities = {
				...newAbilities,
				presence: character.abilities.presence - 1,
				reason: Math.min(4, character.abilities.reason + 1),
			};
		}
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: {
								...character,
								conditions,
								abilities: newAbilities,
								coreMoveState: {
									...character.coreMoveState,
									moonPosition: moonStartPosition,
								},
							},
						}
					: player,
			),
		});
	};

	return (
		<Dialog.Root>
			<Dialog.Trigger
				disabled={disabled}
				className={`bg-theme-bg-secondary text-md hover:bg-theme-bg-accent hover:text-theme-text-accent text-theme-text-primary rounded-lg p-2`}
			>
				Become Restrained
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
					<Dialog.Title className="DialogTitle">Become Restrained</Dialog.Title>
					<Dialog.Description className="DialogDescription">
						Take the condition: Restrained, and choose three of the following:
					</Dialog.Description>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-2 text-sm"
					>
						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								id={useId()}
								{...register("decrease-vitality-checkbox")}
							/>
							<label htmlFor="decrease-vitality-checkbox">
								Decrease Vitality by 1 (to {character.abilities.vitality - 1})
								{character.abilities.composure >= 4
									? ". Your Composure cannot be increased any further"
									: ` and increase Composure by 1 (to ${Math.min(4, character.abilities.composure + 1)})`}
								.
							</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								id={useId()}
								{...register("decrease-presence-checkbox")}
							/>
							<label htmlFor="decrease-presence-checkbox">
								Decrease Presence by 1 (to {character.abilities.presence - 1})
								{character.abilities.reason >= 4
									? ". Your Reason cannot be increased any further"
									: ` and increase Reason by 1 (to ${Math.min(4, character.abilities.reason + 1)})`}
								.
							</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								id={useId()}
								{...register("unmark-old-fire-checkbox")}
							/>
							<label htmlFor="unmark-old-fire">
								Unmark any marked box on The Old Fire; narrate the story
								differently when you mark it again. (Manually after submitting).
							</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								type="checkbox"
								id={useId()}
								{...register("unmark-aspects-checkbox")}
							/>
							<label htmlFor="unmark-aspects-checkbox">
								Unmark all Aspects on a Relic or piece of Equipment that is a
								not weapon. (Manually after submitting).
							</label>
						</div>
						<div className="flex justify-center">
							<button
								type="submit"
								className="mx-auto bg-theme-bg-accent text-theme-text-primary rounded-lg p-2 hover:bg-theme-bg-accent hover:text-theme-text-accent"
							>
								Confirm
							</button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
