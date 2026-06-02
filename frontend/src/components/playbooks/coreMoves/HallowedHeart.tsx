import { useId, useState } from "react";
import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";

export function CoreMoveHallowedHeart({ character }: { character: Character }) {
	const {
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const { coreMoveState } = character;

	if (coreMoveState.type !== "hallowed-heart") return null;
	console.log("virtue: ", coreMoveState.virtue);

	return (
		<div className="flex flex-col gap-2 text-left">
			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				Rise Now, Champion…
			</h3>
			<p>
				You are too fragile and kind for this brutal world. You were meant to
				inspire, to bring forth the greatness in others. After characters have
				been introduced, decide which Ember will best serve as your Champion and
				discuss it with their player. If they accept, ask what Virtue your
				Champion admires about you and wishes to defend.
			</p>

			{coreMoveState.virtue === "" || coreMoveState.virtue === undefined ? (
				editable && <ChooseVirtue character={character} />
			) : (
				<div className="flex gap-2 items-justify">
					<h4 className="text-theme-text-accent font-bold">Virtue:</h4>
					<p>{coreMoveState.virtue}</p>
				</div>
			)}

			<p>
				Your Champion has sworn to protect you, but their devotion is imperfect.
				Their own drive to seek the Hidden Throne is a painful undercurrent
				simmering between you. You may only hope to keep them loyal by being the
				symbol they wish you to be.
			</p>

			<p>The following rules apply:</p>

			<ul className="list-disc list-inside ml-4">
				<li>
					Any action your Champion takes in direct defense of you is taken with
					advantage.
				</li>
				<li>
					Your Champion may also defend you during a Struggle. Either of you may
					invoke when, but your Champion has final say. They answer what may go
					wrong and roll the dice on Light/Dark moves. If your Champion is not
					present, you may call them; they may choose to appear in the scene, no
					matter the distance or circumstance, without making a Journey. They
					must mark an Aspect to do so.
				</li>
				<li>
					Any action you take in direct pursuit of the Virtue your Champion
					admires in their presence is taken with advantage. Any action that
					directly contradicts this Virtue in their presence is taken with
					disadvantage.{" "}
				</li>
				<li>
					If your Champion retires from the game, you must immediately Ascend
					the Throne without them, or become a Supplicant attached to the
					Mourning Tower.
				</li>
			</ul>
		</div>
	);
}

const virtues = [
	"Your beauty - You must act as a reminder of forgotten and future beauty.",
	"Your purity - You must never be tainted or spoil your innocence.",
	"Your hope - You must never yield to despair, but inspire others to defy it.",
	"Your fragility - You must welcome all breaking and wield no weapon.",
];

function ChooseVirtue({ character }: { character: Character }) {
	const { updateGameState, gameState } = useGame();
	const id = useId();

	const [selectedVirtue, setSelectedVirtue] = useState<
		(typeof virtues)[number] | ""
	>("");
	const [allVirtues, setAllVirtues] = useState<string[]>(virtues);

	if (character.playbook !== "hallowed-heart") return null;
	const { coreMoveState } = character;

	const onBlur = (inputValue: string) => {
		setAllVirtues([...allVirtues, inputValue]);
		setSelectedVirtue(inputValue);
	};

	const submit = () => {
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId && player.character
					? {
							...player,
							character: {
								...character,
								coreMoveState: {
									...coreMoveState,
									virtue: selectedVirtue,
								},
							},
						}
					: player,
			),
		});
	};
	return (
		<div className="inline-flex items-center gap-1 flex-col">
			<h4>Your Virtue:</h4>
			{virtues.map((virtue) => {
				return (
					<button
						key={virtue}
						type="button"
						onClick={() => setSelectedVirtue(virtue)}
						className={`${selectedVirtue === virtue ? "bg-theme-bg-accent text-theme-text-accent border border-theme-border-accent" : "bg-theme-bg-secondary text-theme-text-secondary border border-theme-border"} px-2 py-1 rounded-lg`}
					>
						{virtue}
					</button>
				);
			})}
			<textarea
				id={id}
				placeholder="Something else - Ask your Champion what virtue they expect you to always uphold."
				onBlur={(e) => onBlur(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						onBlur(e.currentTarget.value);
					}
				}}
				className="w-full border text-sm px-2 py-1 rounded-lg bg-theme-bg-secondary  hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow whitespace-normal text-theme-text-secondary border-theme-border placeholder:text-theme-text-secondary placeholder:text-center placeholder:opacity-70"
			/>
			<button
				type="button"
				onClick={submit}
				className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
			>
				Confirm
			</button>
		</div>
	);
}
