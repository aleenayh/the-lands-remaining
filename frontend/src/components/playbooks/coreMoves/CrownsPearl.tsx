import { useCallback, useId } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";

export function CoreMoveCrownsPearl({ character }: { character: Character }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const { coreMoveState } = character;

	const toggleBox = useCallback(
		(toggled: boolean) => {
			if (!editable) return;
			if (coreMoveState.type !== "crowns-pearl") return;

			updateGameState({
				players: gameState.players.map((player) =>
					player.id === id
						? {
								...player,
								character: {
									...character,
									coreMoveState: {
										...coreMoveState,
										checks: toggled
											? coreMoveState.checks + 1
											: coreMoveState.checks - 1,
									},
								},
							}
						: player,
				),
			});
		},
		[
			editable,
			character,
			updateGameState,
			gameState.players,
			id,
			coreMoveState,
		],
	);

	const claimSongOfStormAndSilver = useCallback(() => {
		if (!editable) return;
		if (coreMoveState.type !== "crowns-pearl") return;

		updateGameState({
			players: gameState.players.map((player) =>
				player.id === id && player.character
					? {
							...player,
							character: {
								...character,
								relics: [songOfSwordAndSilver, ...character.relics],
								coreMoveState: { ...coreMoveState, resolved: true },
							},
						}
					: player,
			),
		});
	}, [
		editable,
		character,
		updateGameState,
		gameState.players,
		id,
		coreMoveState,
	]);
	if (coreMoveState.type !== "crowns-pearl" || coreMoveState.resolved)
		return null;

	return (
		<div className="flex flex-col gap-2 text-left">
			<h2 className="text-center text-lg font-bold text-theme-text-accent">
				My Word, My Vow…
			</h2>
			<p>
				Take the Condition: Mute. It cannot be cleared. You may communicate
				simple concepts to your fellow Embers with gestures—or writing, if you
				have the time and tools, but some Clues may only be used if you as a
				player narrate how you are able to guide another Ember to it or
				otherwise convey that information.
			</p>

			{coreMoveState.whatStole === "" ? (
				editable && <ChooseWhatStole character={character} />
			) : (
				<p>What stole your voice? {coreMoveState.whatStole}.</p>
			)}

			<p>
				When you attempt to reach out to someone else or someone attempts to
				reach out to you as part of another move, you may withdraw or turn
				inwards, and mark a box instead. If a Clue is discussed, you may not be
				a part of that discussion. Instead, narrate a painful or nostalgic
				sensory memory from your time as a married royal, no longer than a few
				seconds. Examples might be the narrowing of eyes, the sour smell of
				cooked fish, the feel of silk bedsheets, or something else. When all
				boxes are full, cross out this move and clear Mute, and add The Song of
				Storm and Silver to your Relics.
			</p>

			<div className="w-full flex justify-center items-center gap-2">
				{Array.from({ length: 8 }).map((_, index) => (
					<input
						type="checkbox"
						key={`crownspearl-checks-${index}-${coreMoveState.checks}`}
						checked={index < coreMoveState.checks}
						onChange={(e) => toggleBox(e.target.checked)}
					/>
				))}
			</div>

			{coreMoveState.checks === 8 && editable && (
				<button
					type="button"
					onClick={claimSongOfStormAndSilver}
					className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
				>
					Claim the Song of Storm and Silver
				</button>
			)}
		</div>
	);
}

const songOfSwordAndSilver = {
	title: "The Song of Storm and Silver",
	text: "Legends of the merfolk’s enchanted song could be found in every dockside tavern and child’s storybook. Sailors famously claimed that it <aspect>lures men to their doom</aspect>. Romantics hypothesized that it is not something that is heard with the ears at all, but <aspect>it touches the soul directly</aspect>. In a few feverish scrawlings, it is even said that <aspect>it was the last sound heard before the Dimning befell the world</aspect>. Not every merfolk learns the song; some instinctively figure it out, others must be taught by a sea witch.",
	extraLines: 2,
};

function ChooseWhatStole({ character }: { character: Character }) {
	const { updateGameState, gameState } = useGame();
	const { register, handleSubmit } = useForm();
	const id = useId();
	const { ref, onChange, ...rest } = register("whatStole");

	if (character.playbook !== "crowns-pearl") return null;
	const { coreMoveState } = character;

	const submit = (data: FieldValues) => {
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId && player.character
					? {
							...player,
							character: {
								...character,
								coreMoveState: {
									...coreMoveState,
									whatStole: data.whatStole,
								},
							},
						}
					: player,
			),
		});
	};
	return (
		<form
			onSubmit={handleSubmit(submit)}
			className="inline-flex items-center gap-1 flex-col"
		>
			<p className="text-md text-center w-full font-bold">
				Choose what stole your voice:
			</p>
			<p className="text-sm italic">
				A delicate silver chain around your neck, unbreakable by any mortal
				means; Your spouse cut your tongue out and fed it to you; The Sea Witch
				Casylda trapped it in a blue pearl to prevent a prophecized catastrophe;
				Something else.
			</p>
			<input
				{...rest}
				ref={(input) => {
					ref(input);
					input?.focus();
				}}
				id={id}
				type="text"
				onChange={onChange}
				className="w-full border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
			/>
			<button
				type="submit"
				className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
			>
				Confirm
			</button>
		</form>
	);
}
