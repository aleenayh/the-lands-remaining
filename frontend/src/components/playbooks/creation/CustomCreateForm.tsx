import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGame } from "../../../context/GameContext";
import { PlayerRole } from "../../../context/types";
import { AbilityBoxes } from "../sharedComponents/AbilityBoxes";
import type { Character } from "../types";
import { constructAspectArray } from "./CharacterCreateForm";

type CharacterCreateFormInputs = {
	name: string;
	look: string;
	ritual: string;
	stats: {
		vitality: number;
		composure: number;
		reason: number;
		presence: number;
		cinder: number;
	};
	moves: {
		title: string;
		text: string[];
		checks: number[];
		lines: string[];
	}[];
	relics: {
		title: string;
		text: string;
		extraLines: number;
		type: "relic" | "equipment";
	}[];
	cinders: string[];
	questions: string[];
	oldFire: string[];
	fireToCome: string[];
};

const formSteps = [
	"base",
	"moves",
	"relics",
	"questions",
	"cinders",
	"fires",
	"review",
] as const;

export function CustomCreateForm() {
	const { updateGameState, user, gameState } = useGame();
	const [step, setStep] = useState<(typeof formSteps)[number]>(formSteps[0]);
	const [moveModalOpen, setMoveModalOpen] = useState(false);
	const [relicModalOpen, setRelicModalOpen] = useState(false);

	const { register, handleSubmit, watch, setValue } =
		useForm<CharacterCreateFormInputs>({
			defaultValues: {
				name: "",
				look: "",
				ritual: "",
				stats: {
					vitality: 0,
					composure: 0,
					reason: 0,
					presence: 0,
					cinder: -2,
				},
				moves: [],
				relics: [],
				questions: ["", "", "", "", ""],
				oldFire: ["", "", ""],
				fireToCome: [
					"The Kindling Gate: Pick a Cinder (do not mark it if it is unmarked) and cross out all others; tell the other Embers they cannot mark The Kindling Gate on their own sheets. Take the Condition: Herald of [Name of Cinder]. Whenever you act in accordance with—or are negatively affected by—the Condition, mark a box below. When all the boxes are marked, you can unmark them to unmark the Cinder. The Herald Condition cannot be cleared in the normal ways, but you can choose to clear it in order to get an automatic 12+ on a roll. If you do this, cross out The Kindling Gate.",
					"The Tinder Arch: ",
					"The Hearth's Fuel: ",
					"The Ashen Passage: ",
					"The Pyre's Crown: Narrate the moment you turn from the company and walk alone toward the Throne at the heart of the Old Capital. Then, at the end of this play session, read Ascend the Throne.",
				],
				cinders: ["", "", "", "", ""],
			},
		});

	const saveCharacter = (formInputs: CharacterCreateFormInputs) => {
		const character = constructCustomCharacter(formInputs, user.id);
		console.log(`ATTEMPTING TO SAVE CHARACTER: ${JSON.stringify(character)}`);

		const existingPlayerIndex = gameState.players.findIndex(
			(p) => p.id === user.id,
		);

		const updatedPlayers =
			existingPlayerIndex >= 0
				? gameState.players.map((player) =>
						player.id === user.id ? { ...player, character } : player,
					)
				: [
						...gameState.players,
						{
							id: user.id,
							name: user.name,
							lastRoll: null,
							role: PlayerRole.PLAYER,
							character,
						},
					];

		updateGameState({ players: updatedPlayers });
	};

	const stepsInOrder = [
		"base",
		"moves",
		"relics",
		"questions",
		"cinders",
		"fires",
		"review",
	] as const;
	const prettySteps = [
		"Basics",
		"Moves",
		"Relics",
		"Questions",
		"Cinders",
		"Fires",
		"Review",
	] as const;

	return (
		<form
			onSubmit={handleSubmit(saveCharacter)}
			className="flex flex-col gap-2 justify-center"
		>
			<h1 className="text-2xl font-bold text-center">
				Community-Created Ember
			</h1>
			<AnimatePresence>
				<div className="relative overflow-x-hidden overflow-y-auto flex flex-col items-stretch justify-start">
					{step === "base" && (
						<motion.div
							className="flex flex-col gap-2"
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.2 }}
							key="base"
						>
							<p>
								This form allows you to add a community-created Ember to the
								character keeper, albeit with fewer bells and whistles than the
								canonical Embers.
							</p>
							<div className="h-6" />
							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Choose A Name
							</h2>
							<label htmlFor="name" className="text-xs italic">
								Full name line (include titles and honorifics)
							</label>
							<input
								{...register("name")}
								type="text"
								className="border px-2 py-1 flex-grow"
							/>
							<div className="h-6" />

							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Build Your Look
							</h2>
							<label htmlFor="look" className="text-xs italic">
								Full look (three descriptors)
							</label>
							<input
								{...register("look")}
								type="text"
								className="border px-2 py-1 flex-grow"
							/>
							<div className="h-6" />

							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Choose A Ritual
							</h2>
							<input
								{...register("ritual")}
								type="text"
								className="border px-2 py-1 flex-grow"
							/>

							<div className="h-6" />

							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Abilities
							</h2>
							<div className="flex justify-center w-full">
								<div className="grid grid-cols-5 gap-1">
									{(
										Object.entries({
											vitality: 0,
											composure: 0,
											reason: 0,
											presence: 0,
											cinder: 0,
										}) as [
											keyof {
												vitality: 0;
												composure: 0;
												reason: 0;
												presence: 0;
												cinder: -2;
											},
											number,
										][]
									).map(([stat, value]) => (
										<div
											key={stat}
											className="flex flex-col-reverse md:flex-col gap-1"
										>
											<label htmlFor={stat} className="flex flex-col gap-1">
												<span className="text-xs md:text-sm text-theme-text-muted whitespace-nowrap overflow-hidden text-ellipsis">
													{stat}
												</span>
											</label>
											<input
												id={stat}
												type="number"
												defaultValue={value}
												{...register(`stats.${stat}`, { valueAsNumber: true })}
												className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
											/>
										</div>
									))}
								</div>
							</div>
						</motion.div>
					)}

					{step === "moves" && (
						<motion.div
							className="flex flex-col gap-2"
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.2 }}
							key="moves"
						>
							<p className="text-left">
								Only add your starting move(s) at this stage. You will be able
								to add additional moves through the <strong>Advancement</strong>{" "}
								menu during play.
							</p>
							<div className="h-6" />
							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Moves
							</h2>
							{watch("moves").map((move, index) => (
								<div
									key={`create-move-${move.title}`}
									className="flex flex-col gap-2"
								>
									<div className="flex items-center justify-between gap-2">
										<input
											type="text"
											className="w-[60%]"
											value={move.title}
											{...register(`moves.${index}.title`)}
										/>
										<button
											type="button"
											className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
											onClick={() =>
												setValue(
													"moves",
													watch("moves").filter((_, i) => i !== index),
												)
											}
										>
											Remove
										</button>
									</div>
									<textarea
										className="w-full whitespace-normal"
										value={move.text}
										{...register(`moves.${index}.text`)}
									/>
								</div>
							))}
							<Dialog.Root open={moveModalOpen} onOpenChange={setMoveModalOpen}>
								<Dialog.Trigger className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100">
									Add Move
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
											Add Move
										</Dialog.Title>
										<Dialog.Description className="hidden">
											Add a new move to your character.
										</Dialog.Description>
										<WriteMoveModal
											onSubmit={(data) => {
												setValue("moves", [
													...watch("moves"),
													{
														...data,
													},
												]);
												setMoveModalOpen(false);
											}}
										/>
									</Dialog.Content>
								</Dialog.Portal>
							</Dialog.Root>
						</motion.div>
					)}

					{step === "relics" && (
						<motion.div
							className="flex flex-col gap-2"
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.2 }}
							key="relics"
						>
							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Relics
							</h2>
							<div className="text-left">
								Only add your starting relics at this stage. You will be able to
								add additional relics through the <strong>Equipment</strong> or{" "}
								<strong>Rewards</strong> menus during play.
							</div>
							{watch("relics").map((relic, index) => (
								<div
									key={`relic-create-${relic.title}`}
									className="flex flex-col gap-2"
								>
									<div className="flex items-center justify-between gap-2">
										<input
											type="text"
											className="w-[60%]"
											value={relic.title}
											{...register(`relics.${index}.title`)}
										/>
										<button
											type="button"
											className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
											onClick={() =>
												setValue(
													"relics",
													watch("relics").filter((_, i) => i !== index),
												)
											}
										>
											Remove
										</button>
									</div>
									<textarea
										className="w-full whitespace-normal"
										value={relic.text}
										{...register(`relics.${index}.text`)}
									/>
								</div>
							))}
							<Dialog.Root
								open={relicModalOpen}
								onOpenChange={setRelicModalOpen}
							>
								<Dialog.Trigger className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100">
									Add Relic
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
											Add Relic
										</Dialog.Title>
										<Dialog.Description className="hidden">
											Add a new relic to your character.
										</Dialog.Description>
										<AddRelicModal
											onSubmit={(data) => {
												setValue("relics", [
													...watch("relics"),
													{ ...data, type: "relic" },
												]);
												setRelicModalOpen(false);
											}}
										/>
									</Dialog.Content>
								</Dialog.Portal>
							</Dialog.Root>
						</motion.div>
					)}

					{step === "questions" && (
						<motion.div
							className="flex flex-col gap-2 items-center justify-stretch"
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.2 }}
							key="questions"
						>
							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Questions
							</h2>
							{Object.values(watch("questions")).map((value, index) => (
								<div
									className="flex items-center justify-center"
									key={`question-create-${
										// biome-ignore lint/suspicious/noArrayIndexKey: ephemeral form
										index
									}`}
								>
									<input
										type="text"
										className="w-full"
										value={value}
										{...register(`questions.${index}`)}
									/>
									<button
										type="button"
										className="rounded-full bg-theme-bg-accent text-theme-text-accent p-1 ml-4 w-8 h-8 flex items-center justify-center hover:bg-theme-bg-accent hover:text-theme-text-accent"
										onClick={() =>
											setValue(
												"questions",
												watch("questions").filter((_, i) => i !== index),
											)
										}
									>
										{" "}
										-{" "}
									</button>
								</div>
							))}
							<button
								type="button"
								className="rounded-full bg-theme-bg-accent text-theme-text-accent p-1 ml-4 w-8 h-8 flex items-center justify-center hover:bg-theme-bg-accent hover:text-theme-text-accent"
								onClick={() => {
									setValue("questions", [...watch("questions"), ""]);
								}}
							>
								+
							</button>
						</motion.div>
					)}

					{step === "cinders" && (
						<motion.div
							className="flex flex-col gap-2"
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.2 }}
							key="cinders"
						>
							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Cinders
							</h2>
							{Object.values(watch("cinders")).map((value, index) => (
								<div
									className="flex items-center justify-center"
									key={`cinder-create-${
										// biome-ignore lint/suspicious/noArrayIndexKey: ephemeral form
										index
									}`}
								>
									<input
										type="text"
										className="w-full"
										value={value}
										{...register(`cinders.${index}`)}
									/>
									<button
										type="button"
										className="rounded-full bg-theme-bg-accent text-theme-text-accent p-1 ml-4 w-8 h-8 flex items-center justify-center hover:bg-theme-bg-accent hover:text-theme-text-accent"
										onClick={() =>
											setValue(
												"cinders",
												watch("cinders").filter((_, i) => i !== index),
											)
										}
									>
										{" "}
										-{" "}
									</button>
								</div>
							))}
							<button
								type="button"
								className="rounded-full bg-theme-bg-accent text-theme-text-accent p-1 ml-4 w-8 h-8 flex items-center justify-center hover:bg-theme-bg-accent hover:text-theme-text-accent"
								onClick={() => {
									setValue("cinders", [...watch("cinders"), ""]);
								}}
							>
								+
							</button>
						</motion.div>
					)}

					{step === "fires" && (
						<motion.div
							className="flex flex-col gap-2"
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.2 }}
							key="fires"
						>
							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Fires
							</h2>
							<p>
								Note that the text of the fires is not shown to other players.
								You need only add what you find helpful, but do ensure you have
								the right number of boxes by adding <strong>something</strong>{" "}
								for each one.
							</p>

							<h3 className="font-bold text-center text-theme-text-accent text-lg">
								Old Fire
							</h3>
							{Object.values(watch("oldFire")).map((value, index) => (
								<div
									className="flex items-center justify-center"
									key={`oldfire-create-${
										// biome-ignore lint/suspicious/noArrayIndexKey: ephemeral form
										index
									}`}
								>
									<textarea
										className="w-full"
										value={value}
										{...register(`oldFire.${index}`)}
									/>
									<button
										type="button"
										className="rounded-full bg-theme-bg-accent text-theme-text-accent p-1 ml-4 w-8 h-8 flex items-center justify-center hover:bg-theme-bg-accent hover:text-theme-text-accent"
										onClick={() =>
											setValue(
												"oldFire",
												watch("oldFire").filter((_, i) => i !== index),
											)
										}
									>
										-
									</button>
								</div>
							))}
							<button
								type="button"
								className="rounded-full bg-theme-bg-accent text-theme-text-accent p-1 ml-4 w-8 h-8 flex items-center justify-center hover:bg-theme-bg-accent hover:text-theme-text-accent"
								onClick={() => {
									setValue("oldFire", [...watch("oldFire"), ""]);
								}}
							>
								+
							</button>

							<h3 className="font-bold text-center text-theme-text-accent text-lg">
								Fire to Come
							</h3>
							{Object.values(watch("fireToCome")).map((value, index) => (
								<div
									key={`fire-to-come-create-${
										// biome-ignore lint/suspicious/noArrayIndexKey: ephemeral form
										index
									}`}
								>
									<textarea
										className="w-full"
										value={value}
										{...register(`fireToCome.${index}`)}
									/>
								</div>
							))}
						</motion.div>
					)}

					{step === "review" && (
						<motion.div
							className="flex flex-col gap-2"
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -100 }}
							transition={{ duration: 0.2 }}
							key="review"
						>
							<h2 className="font-bold text-center text-theme-text-accent text-lg">
								Review
							</h2>
							<p>
								Review your character and make sure everything is correct. Some
								things can be edited during play, but Cinders, Fires, Questions,
								and your starting Move cannot.
							</p>
							<div className="h-6" />
							<h3 className="font-bold text-center text-theme-text-accent text-lg">
								{watch("name")}
							</h3>
							<p>Look: {watch("look")}</p>
							<p>Ritual: {watch("ritual")}</p>
							<AbilityBoxes stats={watch("stats")} />
							<h3 className="font-bold text-center text-theme-text-accent text-lg">
								Moves
							</h3>
							<p>
								{watch("moves")
									.map((move) => {
										return `${move.title}: ${move.text.join("\n")} (${move.checks.length} checks, ${move.lines.length} lines)`;
									})
									.join("\n\n")}
							</p>
							<div className="h-[0.25rem] bg-theme-bg-accent w-full" />
							<h3 className="font-bold text-center text-theme-text-accent text-lg">
								Relics
							</h3>
							<p>
								{watch("relics")
									.map(
										(relic) =>
											`${relic.title}: ${relic.text} (${relic.extraLines} extra lines)`,
									)
									.join(", ")}
							</p>
							<div className="h-[0.25rem] bg-theme-bg-accent w-full" />
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
								<div className="flex flex-col gap-2">
									<h2>Questions:</h2>{" "}
									{watch("questions").map((question) => {
										return <p key={`question-${question}`}>{question}</p>;
									})}
								</div>
								<div className="flex flex-col gap-2">
									<h2>Cinders:</h2>{" "}
									{watch("cinders").map((cinder) => {
										return <p key={`cinder-${cinder}`}>{cinder}</p>;
									})}
								</div>
							</div>
							<div className="h-[0.25rem] bg-theme-bg-accent w-full" />
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left ">
								<div>
									<h2>Old Fire:</h2>{" "}
									{watch("oldFire").map((fire) => {
										return <p key={`old-fire-${fire}`}>{fire}</p>;
									})}
								</div>
								<div>
									<h2>Fire to Come:</h2>{" "}
									{watch("fireToCome").map((fire) => {
										return <p key={`fire-to-come-${fire}`}>{fire}</p>;
									})}
								</div>
							</div>
						</motion.div>
					)}

					<div className="h-6" />
					<div className="flex flex-col md:flex-row justify-evenly gap-2">
						{step !== "base" && (
							<button
								type="button"
								className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
								onClick={(e) => {
									e.preventDefault();
									setStep(stepsInOrder[stepsInOrder.indexOf(step) - 1]);
								}}
							>
								Return to {prettySteps[stepsInOrder.indexOf(step) - 1]}
							</button>
						)}
						{step !== "review" ? (
							<button
								type="button"
								className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
								onClick={(e) => {
									e.preventDefault();
									setStep(stepsInOrder[stepsInOrder.indexOf(step) + 1]);
								}}
							>
								Continue to {prettySteps[stepsInOrder.indexOf(step) + 1]}
							</button>
						) : (
							<button
								type="submit"
								className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
							>
								Save Character
							</button>
						)}
					</div>
				</div>
			</AnimatePresence>
		</form>
	);
}

function constructCustomCharacter(
	formInputs: CharacterCreateFormInputs,
	userId: string,
): Character {
	const {
		name,
		look,
		ritual,
		stats: { vitality, composure, reason, presence, cinder },
		moves,
		relics,
		questions,
		cinders,
		oldFire,
		fireToCome,
	} = formInputs;

	const conditions: string[] = ["", "", ""];

	const advancements: Record<number, boolean> = {
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false,
		7: false,
		8: false,
		9: false,
	};

	const questionsRecord: Record<number, boolean> = Object.fromEntries(
		questions.map((_, index) => [index, false]),
	);
	const cindersRecord: Record<number, boolean> = Object.fromEntries(
		cinders.map((_, index) => [index, false]),
	);
	const customTextFields = {
		fireToComeDefinitions: fireToCome,
		oldFireDefinitions: oldFire,
		questionDefinitions: questions,
		cinderDefinitions: cinders,
	};
	const oldFireRecord = Object.fromEntries(
		oldFire.map((_, index) => [index, false]),
	);

	return {
		playbook: "custom",
		playerId: userId,
		name,
		look,
		ritual,
		abilities: {
			vitality,
			composure,
			reason,
			presence,
			cinder,
		},
		cinders: cindersRecord,
		relics,
		relicAspects: constructAspectArray(relics),
		oldFire: oldFireRecord,
		fireToCome: {
			"The Kindling Gate": false,
			"The Tinder Arch": false,
			"The Hearth's Fuel": false,
			"The Ashen Passage": false,
			"The Pyre's Crown": false,
		},
		advancements,
		conditions,
		moves,
		coreMoveState: { type: "custom" },
		experience: 0,
		questions: questionsRecord,
		customTextFields,
	};
}

function WriteMoveModal({
	onSubmit,
}: {
	onSubmit: (data: {
		title: string;
		text: string[];
		checks: number[];
		lines: string[];
	}) => void;
}) {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			title: "",
			text: "",
			numberChecks: 0,
			numberLines: 0,
		},
	});

	const parseAspects = (lines: string[]): string[] => {
		return lines.map((line) =>
			line.replace(/<([^>]+)>/g, "<aspect>$1</aspect>"),
		);
	};

	const submit = (data: {
		title: string;
		text: string;
		numberChecks: number;
		numberLines: number;
	}) => {
		const newMove = {
			title: data.title,
			text: parseAspects(data.text.split("\n")),
			checks: Array.from({ length: data.numberChecks }, () => 0),
			lines: Array.from({ length: data.numberLines }, () => ""),
		};
		onSubmit(newMove);
	};

	return (
		<form
			onSubmit={(e) => {
				e.stopPropagation();
				handleSubmit(submit)(e);
			}}
			className="flex flex-col gap-2 justify-center text-theme-text-primary"
		>
			<h2 className="text-2xl font-bold text-center text-theme-text-accent">
				Write a Custom Move
			</h2>
			<p>Name your move below: </p>
			<input
				type="text"
				{...register("title")}
				className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
			/>

			<p>
				Write a description of your move below. To include inline check boxes
				(like aspects), surround your text with &lt; &gt; symbols. For example:{" "}
				<span className="italic">
					once a day you may &lt;gain advantage on a combat-related roll&gt;
				</span>
			</p>
			<textarea
				{...register("text")}
				className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
			/>

			<p>
				Optionally, moves can include some number of unlabeled check boxes or
				editable blank lines. Define the number of each below. If you need a
				labeled check box, instead add it to your description as an
				&lt;aspect&gt;.
			</p>
			<div className="grid grid-cols-4 gap-2">
				<p>Checkboxes:</p>
				<input
					type="number"
					{...register("numberChecks")}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				/>
				<p>Lines:</p>
				<input
					type="number"
					{...register("numberLines")}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				/>
			</div>
			<button
				type="submit"
				className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
			>
				Add Move
			</button>
		</form>
	);
}

function AddRelicModal({
	onSubmit,
}: {
	onSubmit: (data: { title: string; text: string; extraLines: number }) => void;
}) {
	const { register, handleSubmit } = useForm<{
		title: string;
		text: string;
		extraLines: number;
	}>({
		defaultValues: {
			title: "",
			text: "",
			extraLines: 0,
		},
	});

	const parseAspects = (lines: string[]): string[] => {
		return lines.map((line) =>
			line.replace(/<([^>]+)>/g, "<aspect>$1</aspect>"),
		);
	};

	const submit = (data: {
		title: string;
		text: string;
		extraLines: number;
	}) => {
		const newRelic = {
			title: data.title,
			text: parseAspects(data.text.split("\n")).join("\n"),
			extraLines: data.extraLines,
		};
		onSubmit(newRelic);
	};

	return (
		<form
			onSubmit={(e) => {
				e.stopPropagation();
				handleSubmit(submit)(e);
			}}
		>
			<div className="flex flex-col gap-2">
				<label htmlFor="title">Title</label>
				<input
					type="text"
					{...register("title")}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				/>

				<p>
					Write or paste the description of the relic below. To include aspects,
					surround your text with &lt; &gt; symbols. For example:{" "}
					<span className="italic">
						a burnished sword that &lt;glows with the light of the morning&gt;
					</span>
				</p>
				<textarea
					{...register("text")}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				/>

				<p>
					If the relic includes customizable aspects you may add later, include
					a number of blank lines for them below.
				</p>
				<input
					type="number"
					{...register("extraLines")}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				/>

				<button
					type="submit"
					className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
				>
					Confirm
				</button>
			</div>
		</form>
	);
}
