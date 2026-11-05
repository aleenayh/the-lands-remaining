import toast from "react-hot-toast";
import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";

export function CoreMoveStormSaint({ character }: { character: Character }) {
	const { coreMoveState } = character;
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const stormbound = gameState.players
		.find((player) => player.id === character.playerId)
		?.character?.conditions.some((condition) => condition === "Stormbound");

	const toggleBox = (index: number) => {
		if (!editable) return;
		if (coreMoveState.type !== "storm-saint") return;

		const newBoxes = [...coreMoveState.boxes];
		newBoxes[index] = !newBoxes[index];
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === id
					? {
							...player,
							character: {
								...character,
								coreMoveState: {
									...coreMoveState,
									boxes: newBoxes,
								},
							},
						}
					: player,
			),
		});
	};

	const toggleEmberBox = (index: number) => {
		if (!editable) return;
		if (coreMoveState.type !== "storm-saint") return;

		toast.error("Not implemented");
	};

	const toggleStormbound = () => {
		if (!editable) return;
		if (coreMoveState.type !== "storm-saint") return;

		toast.error("Not implemented");
	};

	if (coreMoveState.type !== "storm-saint") return null;
	return (
		<div className="flex flex-col gap-2 text-left">
			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				May the Sacred Storm preserve and protect
			</h3>

			<p>
				Petty magicians may conduct a ritual to move a cloud, but you have the
				Sacred Storm itself within you; you do not command the rains and winds,
				you are the rains and winds. Where you will them, they will be. Or so it
				was, before the Dimning - now things are sometimes less predictable.
			</p>

			<p>
				When you wield the power of the Sacred Storm within you, narrate an
				effect below and take the Condition Stormbound. While you are
				Stormbound, your Composure is decreased by 3 and your Cinder is
				increased by 2 (no max). While Stormbound you may roll Cinder to
				activate an additional effect (or the same effect again). On a 6-, you
				do it, but must mark a box on the track below. On a 7+, the effect is
				without cost.
			</p>

			<ul className="list-disc list-inside">
				<li>
					Summon a gale capable of hurling creatures or tearing down structures
				</li>
				<li>
					Knit together clouds to blot out the sun or moons; you and any Embers
					in the scene have advantage on rolls which make use of the darkness
				</li>

				<li>
					Call lightning to fulminate a Side Character or Danger, killing or
					incapacitating them
				</li>

				<li>
					Create a torrential rain, flooding the Location and rendering it
					impassable except to those with means to travel in water
				</li>

				<li>
					Reduce the temperature until frost blooms petrify all living things
				</li>

				<li>
					Create thunderwaves loud enough to deafen, disrupting any magic that
					requires sound
				</li>
			</ul>

			{editable && (
				<button
					type="button"
					className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
					onClick={toggleStormbound}
				>
					{stormbound ? "Clear Stormbound" : "Become Stormbound"}
				</button>
			)}

			<p>
				For each subsequent scene that you remain Stormbound, describe how your
				body is strained and cracked by the Sacred Storm and mark a box below.
				When all boxes are marked, your body is no longer a viable vessel for
				the Sacred Storm and you must stoke the Pyre's Crown.
			</p>

			<div className="flex gap-2 justify-center">
				{Array.from({ length: 12 }).map((_, index) => (
					<input
						key={index}
						disabled={!editable}
						type="checkbox"
						checked={coreMoveState.boxes[index]}
						onChange={() => toggleBox(index)}
					/>
				))}
			</div>

			<p>
				To clear Stormbound, ask another Ember in the scene to narrate how they
				invoke the bonds between you to return you to your senses. If they do,
				erase two boxes on their track below. You are restored and the Condition
				clears. If no Embers are available, willing, or able to help, you may
				also clear Stormbound through an unpredictable discharge of power. The
				Keeper will describe it, and tell you how you are vulnerable to
				immediate danger.
			</p>

			<p>
				It is no trivial matter to reach into the center of the storm; only
				those with strong ties can make their voices heard above the howling
				wind. Write each of your fellow Ember’s names on a line below. Once per
				session, when you establish trust or deepen your relationship with
				another Ember, mark one of the boxes beside their name, until the track
				is full.
			</p>

			{Array.from({ length: 4 }).map((_, index) => (
				<div key={index}>
					<p>{coreMoveState.emberNames[index]}</p>
					{Array.from({ length: 3 }).map((_, index) => (
						<input
							key={index}
							type="checkbox"
							onChange={() => toggleEmberBox(index)}
						/>
					))}
				</div>
			))}
		</div>
	);
}
