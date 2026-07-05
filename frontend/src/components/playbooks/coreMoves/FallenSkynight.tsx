import { useForm } from "react-hook-form";
import { useGame } from "../../../context/GameContext";
import type { Character } from "../types";

export function CoreMoveFallenSkynight({
	character,
}: {
	character: Character;
}) {
	return (
		<div className="flex flex-col gap-2 text-left">
			<NameTheFledgling character={character} />
			<KnowsNoEqual character={character} />
			<NotEvenAmongTheLordsAboveThem />
		</div>
	);
}

function NameTheFledgling({ character }: { character: Character }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const { register, handleSubmit } = useForm<{
		fledglingName: string;
		fledglingAspect: string;
	}>({
		defaultValues: {
			fledglingName: "",
			fledglingAspect: "",
		},
	});
	const editable = id === character.playerId;
	const { coreMoveState } = character;
	if (coreMoveState.type !== "skynight" || !editable) return null;
	const { fledglingName } = coreMoveState;
	if (fledglingName) return null;

	const onSubmit = (data: {
		fledglingName: string;
		fledglingAspect: string;
	}) => {
		const oldRelics = character.relics.filter(
			(relic) => relic.title !== "The Fledgling",
		);
		const newFledgling = {
			title: `${data.fledglingName} the Fledgling`,
			text: `A juvenile airbeast, roughly the size of a large housecat, though it will be much larger someday. For now, it can <aspect>glide short distances and carry small objects</aspect>, but mostly it takes long naps and chirrups when hungry, which is often. Despite the fearsome mien of its older kin, many find its current childlike curiosity and budding intelligence <aspect>quite adorable</aspect>. ${data.fledglingAspect}`,
			extraLines: 3,
			type: "relic",
		};
		const newRelics = [...oldRelics, newFledgling];

		updateGameState({
			...gameState,
			players: gameState.players.map((player) =>
				player.id === id
					? {
							...player,
							relics: newRelics,
						}
					: player,
			),
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				Name the Fledgling
			</h3>
			<div className="flex flex-col gap-2">
				<p>
					Pick one or choose a name related to its defining feature, its habits,
					or the name of a dead monarch.
				</p>
				<p className="text-xs text-theme-text-secondary italic">
					Beak, Redwing, Sting, Streak, Dash, Snow, Swift, Jade, Onyx, Pounce,
					Smoke, Gambit, Queenie, Shadow, Stripes, Monarch, Neweh, Florra,
					Patendo, Setast
				</p>
				<input type="text" className="w-full" {...register("fledglingName")} />
				<p className="italic">
					A juvenile airbeast, roughly the size of a large housecat, though it
					will be much larger someday. For now, it can{" "}
					<strong>glide short distances and carry small objects</strong>, but
					mostly it takes long naps and chirrups when hungry, which is often.
					Despite the fearsome mien of its older kin, many find its current
					childlike curiosity and budding intelligence{" "}
					<strong>quite adorable.</strong>
				</p>

				<p>
					Give the Fledgling one more Aspect based on the kind of creature it
					is. A wyvern might have a poisonous sting, a gryphon has rending
					talons, a hippogriff might have unmatched speed and agility for one so
					small.
				</p>
				<input
					type="text"
					placeholder="add an aspect..."
					className="w-full"
					{...register("fledglingAspect")}
				/>
				<button
					type="submit"
					className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
				>
					Confirm
				</button>
			</div>
		</form>
	);
}

function KnowsNoEqual({ character }: { character: Character }) {
	const {
		user: { id },
		gameState,
		updateGameState,
	} = useGame();
	const editable = id === character.playerId;
	const { coreMoveState } = character;
	if (coreMoveState.type !== "skynight") return null;
	const { rivalName, rivalBoxes } = coreMoveState;
	const hasPeerMove = character.moves.some(
		(move) => move.title === "…Nor Even In Their Peers.",
	);

	const toggleRivalBox = (index: number) => {
		const newRivalBoxes = [...rivalBoxes];
		newRivalBoxes[index] = !newRivalBoxes[index];
		updateGameState({
			...gameState,
			players: gameState.players.map((player) =>
				player.id === id
					? {
							...player,
							coreMoveState: {
								...coreMoveState,
								rivalBoxes: newRivalBoxes,
							},
						}
					: player,
			),
		});
	};

	return (
		<div>
			<h4>A Skyknight Knows No Equal…</h4>
			{rivalName ? (
				<p>
					Your Rival in the Great Lord’s service, {rivalName}, plans, schemes,
					and acts in the background. They can appear whenever the Keeper
					chooses.
				</p>
			) : (
				<NameYourRival character={character} />
			)}
			<p>
				After any roll other than Answer a Question, you may add 1 by marking a
				box below (this cannot stack with help from another Ember marking an
				Aspect). When the last box is filled, one of your Rival’s schemes comes
				to fruition, which may result in an immediate conflict, or some other
				plot putting you, fellow Embers, Side Characters, Supplicants, any
				combination of the above, or more, in significant peril. You may clear
				all of the boxes by foiling their scheme.
			</p>
			<p>
				You can never truly be rid of your Rival. They will always return. If
				the Lord is defeated and the story continues, they will swear service to
				the next Lord that promises them the power to defeat you.
			</p>
			<div className="w-full flex justify-center gap-2">
				{Array.from({ length: 4 }).map((_, index) => (
					<input
						key={`rivalBox-${index}`}
						type="checkbox"
						disabled={!editable || (index === 3 && hasPeerMove)}
						checked={rivalBoxes[index] || (index === 3 && hasPeerMove)}
						onChange={() => {
							toggleRivalBox(index);
						}}
					/>
				))}
			</div>
			<p>
				When you share a vulnerable moment with your Rival while performing your
				Ritual, you may clear an appropriate Condition, and the Rival may ask
				you any question they wish; you must answer truthfully and completely.
			</p>
		</div>
	);
}

function NameYourRival({ character }: { character: Character }) {
	const {
		user: { id },
		gameState,
		updateGameState,
	} = useGame();
	const editable = id === character.playerId;
	const { coreMoveState } = character;
	const { register, handleSubmit } = useForm<{ rivalName: string }>({
		defaultValues: {
			rivalName: "",
		},
	});
	if (coreMoveState.type !== "skynight" || !editable) return null;

	const onSubmit = (data: { rivalName: string }) => {
		updateGameState({
			...gameState,
			players: gameState.players.map((player) =>
				player.id === id
					? {
							...player,
							coreMoveState: {
								...coreMoveState,
								rivalName: data.rivalName,
							},
						}
					: player,
			),
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<p>
				Your Rival in the Great Lord’s service, plans, schemes, and acts in the
				background. They can appear whenever the Keeper chooses. Name them using
				the lists below, or make up your own.
			</p>
			<p className="text-xs text-theme-text-secondary italic">
				Straea, Beleze, Altenora, Pallax, Torono, Valestra, Revel, Orsen, Nalor,
				Krace, Jenneth, Siga, Ariado, Firon, Shyri, Tessel, Tevesh, Kyro,
				Doritea, Salenina{" "}
			</p>
			<p className="text-xs text-theme-text-secondary italic">
				Skydancer, Highcloud, Thunderheart, Swiftwing, Redwind, Mooncrest,
				Starcaller, Silversong, Stormswallow, Mourningfeather, the Ghost of
				Vyrag, the Baron Ablaze, the Stormtamer, the Rose of Dawn, the Maiden of
				Marcuria, the Star of Fury, the Pale Shrike, the Dragonslayer, the
				Moons’ Chosen, the Rising Sun
			</p>
			<input
				type="text"
				placeholder="Name your Rival"
				{...register("rivalName")}
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

function NotEvenAmongTheLordsAboveThem() {
	return (
		<div>
			<h4>Not Even Among the Lords Above Them…</h4>
			<p>
				Because of your prior proximity to the Lord and their plans, you can
				more easily see the interconnected web being woven. When you Answer a
				Question, you may incorporate one Lord Clue into the Theory. This does
				not “consume” the Clue, but each Lord Clue may only be used once in this
				way.
			</p>
		</div>
	);
}
