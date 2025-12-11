import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";

export function CoreMoveNameless({ character }: { character: Character }) {
	return (
		<div className="flex flex-col gap-2 text-left">
			<h2 className="text-lg font-bold text-theme-text-accent text-center">
				The Nameless Legion Endures…
			</h2>
			<p>
				The remnants of the Nameless Legion endure as a corps of specters that
				reveal themselves when called upon by you. These spectral knights appear
				as they did in life, but ghostly green and translucent. You will give
				them each a name, releasing them to their true rest. Some can briefly
				interact with the physical world, and will stay to help you in your
				trials; others must be named and released immediately.
			</p>

			<p>
				When instructed to name a member of the Legion, cross off a name below
				and speak: “I name you [Name] and release you from your burdens.” The
				spectre immediately disappears. When all names have been crossed off,
				mark The Pyre’s Crown.{" "}
			</p>

			<Legion character={character} />

			<p>
				When you call upon the Nameless Legion for help, roll with Cinder. On a
				hit, a number of spectral knights appear. Each knight not immediately
				named will stay for a short time, and grants 1 to any roll associated
				with actions they help with (yours or another Ember’s). Multiple knights
				can help with a single action, but each knight can only assist once in
				this way. Whenever there is a break in the action, knights who help in
				this way must be named.
			</p>

			<ul className="ml-4 list-disc list-inside">
				<li>On a 10+, roll a die; that many knights appear.</li>
				<li>
					On a 7-9, roll a die; that many knights appear, but all but one must
					be named immediately.{" "}
				</li>
				<li>
					On a miss, roll a die; that many knights appear, and all must be named
					immediately.
				</li>
				<li>
					On a 12+, roll a die; that many knights appear, and one will stay
					longer than the rest (they can help with two actions instead of one).
				</li>
			</ul>
			<p>
				All summoned knights must be named before this move can be used again.
			</p>
		</div>
	);
}

function Legion({ character }: { character: Character }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const { coreMoveState } = character;
	const editable = id === character.playerId;
	if (coreMoveState.type !== "nameless") return null;
	const legionState = coreMoveState.legion;

	const nameLegionaire = (index: number) => {
		if (!editable) return;
		const newLegionState = [...legionState];
		newLegionState[index] = true;
		coreMoveState.legion = newLegionState;
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId && player.character
					? { ...player, character: { ...player.character, coreMoveState } }
					: player,
			),
		});
	};

	return (
		<div className="grid grid-cols-4 text-xs gap-1 justify-center items-center">
			{legionState.map((isNamed, index) => (
				<div key={`${legionNames[index]}`}>
					<AnimatePresence>
						{!isNamed && (
							<motion.div
								key={`${legionNames[index]}-${isNamed}`}
								initial={{ opacity: 1 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 1 }}
							>
								<button
									type="button"
									className="w-full h-full bg-theme-bg-secondary text-theme-text-primary rounded-md p-2 transition-opacity duration-1000"
									onClick={() => nameLegionaire(index)}
									disabled={!editable}
								>
									{legionNames[index]}
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			))}
		</div>
	);
}

export const legionNames = [
	"Andyr the Brave",
	"Sandyn the Swift",
	"Kael the Unbroken",
	"Mireth the Faithful",
	"Olan the Sure-Handed",
	"Seris the Bright",
	"Daren the Watchful",
	"Liora the Gentle",
	"Thalen the Iron-Bound",
	"Corren the True",
	"Isen the Quiet",
	"Faedra the Gold-Eyed",
	"Jarek the Stone-Hearted",
	"Veyna the Steadfast",
	"Malen the Just",
	"Orris the Dawn-Bearer",
	"Senn the Kindly",
	"Tyra the Relentless",
	"Korr the Shielded",
	"Elandra the Pure",
	"Tavin the Loyal",
	"Nyra the Unyielding",
	"Garren the Bold",
	"Asha the Clear-Voiced",
	"Brenn the Vigilant",
	"Kelis the Silver-Handed",
	"Rowan the Patient",
	"Elyra the Bright-Souled",
	"Caed the Unfaltering",
	"Lirren the Stalwart",
	"Tessa the Golden",
	"Vorr the Flame-Born",
	"Iral the Sure-Footed",
	"Maera the Even-Handed",
	"Oren the Kind",
	"Kaith the Unseen",
	"Daryn the Resolute",
	"Selda the Keen",
	"Merek the Pale",
	"Orra the Quick",
	"Toren the Measured",
	"Fira the Ashen",
	"Calen the Graced",
	"Nyric the First-Sword",
	"Rhal the Last-Guard",
	"Enda the Soft-Spoken",
	"Taren the Gold-Blooded",
	"Lysa the Fearless",
	"Corin the Sure",
	"Valea the Bright-Eyed",
	"Jorn the Steady",
	"Meira the Far-Sighted",
	"Thel the Strong",
	"Rynn the Warden",
	"Sareth the Even",
	"Dalen the Just-Handed",
	"Aeris the True-Hearted",
	"Torra the Flame-Kissed",
	"Vann the Dying-Light",
	"Caera the Last",
];
