import { useCallback } from "react";
import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";

export function CoreMoveLoneFamisher({ character }: { character: Character }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const { coreMoveState } = character;
	const currentHungerCondition = character.conditions.find((condition) =>
		condition.startsWith("Hunger: "),
	);
	const nextHungerCondition = getNext(currentHungerCondition);
	const conditionsFull =
		!currentHungerCondition &&
		!character.conditions.some((condition) => condition === "");
	const insatiable = currentHungerCondition === "Hunger: Insatiable";

	const toggleHunger = useCallback(
		(checked: boolean) => {
			if (!editable) return;
			if (coreMoveState.type !== "famisher") return;
			const checks = checked
				? coreMoveState.checks + 1
				: coreMoveState.checks - 1;

			updateGameState({
				players: gameState.players.map((player) =>
					player.id === id
						? {
								...player,
								character: {
									...character,
									coreMoveState: { ...coreMoveState, checks },
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

	const takeCondition = useCallback(() => {
		if (!editable) return;
		if (coreMoveState.type !== "famisher") return;
		let indexToOverwrite: number;
		if (currentHungerCondition) {
			indexToOverwrite = character.conditions.indexOf(currentHungerCondition);
		} else if (character.conditions.some((condition) => condition === "")) {
			indexToOverwrite = character.conditions.indexOf("");
		} else {
			console.error("No index found; using index 0");
			indexToOverwrite = 0;
		}
		const conditions = [...character.conditions];
		conditions[indexToOverwrite] = `Hunger: ${nextHungerCondition}`;

		updateGameState({
			players: gameState.players.map((player) =>
				player.id === id
					? {
							...player,
							character: {
								...character,
								conditions,
								coreMoveState: { ...coreMoveState, checks: 0 },
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
		nextHungerCondition,
		currentHungerCondition,
	]);
	if (coreMoveState.type !== "famisher") return null;

	if (insatiable) {
		return <StaticInsatiable />;
	}

	return (
		<div className="flex flex-col gap-2 text-left">
			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				There is no god greater than Hunger…
			</h3>
			<p>
				When you use violence to get what you want, when you fell a creature in
				bloody battle, or when an Ember move or the Keeper instructs you to do
				so, mark a box on your Hunger track.
			</p>

			<div className="flex justify-center gap-2">
				{Array.from({ length: 3 }).map((_, index) => (
					<input
						type="checkbox"
						key={`famisher-hunger-${
							// biome-ignore lint/suspicious/noArrayIndexKey: boxes
							index
						}`}
						checked={coreMoveState.checks >= index + 1}
						onChange={(e) => toggleHunger(e.target.checked)}
						disabled={!editable}
					/>
				))}
			</div>
			{coreMoveState.checks === 3 && editable && (
				<div className="flex flex-col gap-2 justify-center items-center">
					{conditionsFull && (
						<p className="font-bold text-theme-text-accent">
							You have three active conditions and must take a hunger condition.
							Immediately stoke the fire to clear an existing condition, then
							return to take your Hunger condition.
						</p>
					)}
					<button
						type="button"
						onClick={takeCondition}
						disabled={conditionsFull}
						className={`bg-theme-bg-secondary text-md hover:bg-theme-bg-accent hover:text-theme-text-accent text-theme-text-primary rounded-lg p-2 ${conditionsFull ? "bg-theme-bg-accent text-theme-text-accent cursor-not-allowed" : ""}`}
					>
						Become {nextHungerCondition}
					</button>
				</div>
			)}
			<p>
				When all boxes on your Hunger track have been marked, take the Hunger
				Condition: Voracious and clear the track. When you have a Hunger
				Condition, all rolls using Vitality and Presence are made with
				advantage, while all rolls using Reason and Composure are made at
				disadvantage. Additionally, you can clear this Hunger Condition at any
				time to bump up the success tier of a roll.
			</p>

			<p>
				If you are already Voracious, change it to Ravenous; you can always
				re-roll a single die in any roll that uses Vitality so long as you have
				this Hunger Condition. If you are already Ravenous, change it to
				Insatiable and cross out your Hunger track (move effects that reference
				the Hunger track are ignored). Insatiable is a permanent Condition and
				cannot be cleared in any way; Insatiable grants all advantages of
				Voracious and Ravenous.
			</p>
		</div>
	);
}

function StaticInsatiable() {
	return (
		<div className="flex flex-col gap-2 text-left">
			<h2 className="text-center text-lg font-bold text-theme-text-accent">
				There is no god greater than Hunger…
			</h2>
			<p>
				You are Insatiable. Insatiable is a permanent Condition and cannot be
				cleared in any way.
			</p>

			<p>
				All rolls using Vitality and Presence are made with advantage, while all
				rolls using Reason and Composure are made at disadvantage. You can
				always re-roll a single die in any roll that uses Vitality.
			</p>
		</div>
	);
}

function getNext(condition: string | undefined): string {
	if (condition === "Hunger: Voracious") return "Ravenous";
	if (condition === "Hunger: Ravenous") return "Insatiable";
	return "Voracious";
}
