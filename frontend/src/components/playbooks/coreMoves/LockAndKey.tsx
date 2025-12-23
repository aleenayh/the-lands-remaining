import { useCallback } from "react";
import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";
import { parseRelicText } from "../utils";

export function CoreMoveLockAndKey({ character }: { character: Character }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const { coreMoveState } = character;

	const toggleAspect = useCallback(
		(index: number) => {
			if (!editable) return;
			if (coreMoveState.type !== "lock-and-key") return;

			const newAspects = [...coreMoveState.checks];
			newAspects[index] = newAspects[index] === 1 ? 0 : 1;
			updateGameState({
				players: gameState.players.map((player) =>
					player.id === id
						? {
								...player,
								character: {
									...character,
									coreMoveState: { ...coreMoveState, checks: newAspects },
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
	if (coreMoveState.type !== "lock-and-key") return null;

	return (
		<div className="flex flex-col gap-2 text-left">
			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				The Mouse in the Tower…
			</h3>
			<p>
				You have mastered a form of martial arts inspired by a story told to
				small children raised in your order. The Aspects of the story function
				as any other Aspect; additionally, when engaged in unarmed combat, you
				can mark one to re-roll a single die from an associated roll.
			</p>

			<p className="inline text-left ml-4">
				{
					parseRelicText(story, coreMoveState.checks, 0, editable, toggleAspect)
						.elements
				}
			</p>
		</div>
	);
}

const story = `“There once was a tower no hand could climb, <aspect>no blade could break</aspect>, <aspect>no army could shake</aspect>—but the little mouse decided to try anyway. On the first stair sat the Cat, <aspect>still as a frost-covered stone</aspect>; the mouse waited until the Cat fell asleep, then bowed low and <aspect>slipped past its paws as softly as dust</aspect>. Higher up coiled the Snake, <aspect>breath held sharp and ready</aspect>; the mouse felt <aspect>the tiny pause between inhale and strike</aspect>, and tiptoed through that quiet moment before the Snake could notice. Higher still perched the Crow, <aspect>clever eyes seeing every path at once</aspect>; the mouse listened to its own small heartbeat, chose a way that wasn’t a path at all, and kept climbing. Up and up it went—<aspect>past shadows that parted for the gentle</aspect>, <aspect>past doors that yielded to patience</aspect>, past places too tight for the mighty but <aspect>just right for the meek</aspect>. At last, at the very top, the mouse found a crystal door <aspect>smooth and clear as still water</aspect>. It placed its tiny paw on the shining surface, breath steady, and whispered: <aspect>’I am small, but I am here.’</aspect>”`;
