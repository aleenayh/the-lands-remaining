import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGame } from "../../../context/GameContext";
import { advancements, playbookBases } from "../content";
import { coreMoveTitles } from "../coreMoves";
import { constructAspectArray } from "../creation/CharacterCreateForm";
import { orderAbilities } from "../sharedComponents/AbilityBoxes";
import type { Abilities, Character } from "../types";

export function AdvancementModal() {
	const {
		gameState,
		user: { id },
	} = useGame();
	const [step, setStep] = useState<
		| "select-advancement"
		| "adjust-stats"
		| "increase-cinder"
		| "select-move"
		| "write-custom-move"
		| "unmark-aspects"
	>("select-advancement");
	const [open, onOpenChange] = useState(false);
	const [advancementIndex, setAdvancementIndex] = useState<number | null>(null);
	const character = gameState.players.find(
		(player) => player.id === id,
	)?.character;
	if (!character) {
		return null;
	}
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setStep("select-advancement");
			setAdvancementIndex(null);
		}
		onOpenChange(open);
	};

	const { advancements: advancementProgress } = character;
	const advancementOptions = Object.keys(advancements).map((key) => ({
		id: parseInt(key, 10),
		title: advancements[parseInt(key, 10)],
	}));

	const handleChangeStep = (advancementIndex: number) => {
		setAdvancementIndex(advancementIndex);
		switch (advancementIndex) {
			case 1:
			case 2:
			case 3:
				setStep("adjust-stats");
				break;
			case 4:
				setStep("increase-cinder");
				break;
			case 5:
			case 6:
				setStep("select-move");
				break;
			case 7:
				setStep("write-custom-move");
				break;
			default:
				setStep("unmark-aspects");
				break;
		}
	};

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Dialog.Trigger asChild className="DialogTrigger">
				<button type="button">Advancement</button>
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
						Select an Advancement
					</Dialog.Title>
					<div className="flex flex-col gap-4 min-h-[50vh] overflow-y-auto">
						<AnimatePresence>
							{step !== "select-advancement" && (
								<BackButton
									setStep={setStep}
									setAdvancementIndex={setAdvancementIndex}
								/>
							)}
							{step === "select-advancement" && (
								<motion.div
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.2 }}
									className="flex flex-col gap-4 mt-4"
								>
									{advancementOptions.map((option) => (
										<div key={`advancement-${option.id}`}>
											<button
												type="button"
												onClick={() => handleChangeStep(option.id)}
												disabled={advancementProgress[option.id]}
												className={`flex items-center gap-2 ${advancementProgress[option.id] ? "text-theme-text-muted" : "text-theme-text-primary"}`}
											>
												{advancementProgress[option.id] ? (
													<span>✓</span>
												) : (
													<span>○</span>
												)}
												{option.title}
											</button>
										</div>
									))}
								</motion.div>
							)}
							{step === "select-move" && (
								<motion.div
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.2 }}
								>
									<MoveSelector
										character={character}
										closeModal={() => handleOpenChange(false)}
										advancementIndex={advancementIndex}
									/>
								</motion.div>
							)}
							{step === "write-custom-move" && (
								<motion.div
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.2 }}
								>
									<MoveWriter
										character={character}
										closeModal={() => handleOpenChange(false)}
										advancementIndex={advancementIndex}
									/>
								</motion.div>
							)}
							{step === "unmark-aspects" && (
								<motion.div
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.2 }}
								>
									<UnmarkAspects
										character={character}
										closeModal={() => handleOpenChange(false)}
										advancementIndex={advancementIndex}
									/>
								</motion.div>
							)}
							{(step === "adjust-stats" || step === "increase-cinder") && (
								<motion.div
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.2 }}
								>
									<AdjustStats
										character={character}
										closeModal={() => handleOpenChange(false)}
										cinderVersion={step === "increase-cinder"}
										advancementIndex={advancementIndex}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function BackButton({
	setStep,
	setAdvancementIndex,
}: {
	setStep: (step: "select-advancement") => void;
	setAdvancementIndex: (advancementIndex: number | null) => void;
}) {
	return (
		<div className="mx-auto w-full gap-4 flex justify-start items-center">
			<button
				type="button"
				className="text-theme-text-primary rounded-md hover:text-theme-text-accent"
				onClick={() => {
					setStep("select-advancement");
					setAdvancementIndex(null);
				}}
			>
				← Back to Advancements
			</button>
		</div>
	);
}

function ConfirmChoice({ onClick }: { onClick: () => void }) {
	return (
		<div className="mx-auto w-1/3 gap-4 flex justify-center items-center">
			<button
				type="button"
				onClick={onClick}
				className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2 hover:bg-theme-bg-accent-hover hover:text-theme-text-primary-hover"
			>
				Confirm
			</button>
		</div>
	);
}

function MoveSelector({
	character,
	closeModal,
	advancementIndex,
}: {
	character: Character;
	closeModal: () => void;
	advancementIndex: number | null;
}) {
	const { gameState, updateGameState } = useGame();
	const existingMoves =
		gameState.players.find((player) => player.id === character.playerId)
			?.character?.moves ?? [];
	const moves = playbookBases[character.playbook].moves;
	const [selectedMove, setSelectedMove] = useState<string | null>(null);

	const onComfirm = () => {
		const newMove = moves.find((m) => m.title === selectedMove);
		if (!newMove) {
			return;
		}
		if (advancementIndex === null) {
			return;
		}
		const newAdvancements = {
			...character.advancements,
			[advancementIndex]: true,
		};
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: {
								...character,
								moves: [
									...existingMoves,
									{ checks: [], lines: [], ...newMove },
								],
								advancements: newAdvancements,
							},
						}
					: player,
			),
		});
		closeModal();
	};

	return (
		<div className="flex flex-col gap-2 justify-center items-center">
			<h2>Your Current Moves</h2>
			<div
				key={coreMoveTitles[character.playbook]}
				className="flex flex-col gap-2 text-theme-text-muted"
			>
				{coreMoveTitles[character.playbook]}
			</div>
			{existingMoves.length > 0 && (
				<div className="flex flex-col gap-2 text-theme-text-muted">
					{existingMoves.map((move) => (
						<div key={move.title}>{move.title}</div>
					))}
				</div>
			)}

			<h2>Select an Additional Move</h2>
			<p className="italic text-xs text-theme-text-muted">
				Tap any move to expand.
			</p>
			{moves.map((move) => {
				if (existingMoves.some((m) => m.title === move.title)) {
					return null;
				}
				return (
					<div key={move.title}>
						<button
							onClick={() => setSelectedMove(move.title)}
							type="button"
							disabled={existingMoves.some((m) => m.title === move.title)}
							className={`${selectedMove === move.title ? "bg-theme-bg-accent text-theme-text-primary" : "bg-theme-bg-secondary text-theme-text-secondary"}`}
						>
							{move.title}
						</button>
						{selectedMove === move.title && (
							<div className="flex flex-col gap-2 text-sm">
								{move.text.map((line) => (
									<div key={line}>{line}</div>
								))}
							</div>
						)}
					</div>
				);
			})}
			<ConfirmChoice onClick={onComfirm} />
		</div>
	);
}

function MoveWriter({
	character,
	closeModal,
	advancementIndex,
}: {
	character: Character;
	closeModal: () => void;
	advancementIndex: number | null;
}) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const existingMoves = character.moves;
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
	const onSubmit = (data: {
		title: string;
		text: string;
		numberChecks: number;
		numberLines: number;
	}) => {
		const newMove = {
			title: data.title,
			text: parseAspects(data.text.split("\n")),
			checks: Array.from({ length: data.numberChecks }, () => false),
			lines: Array.from({ length: data.numberLines }, () => ""),
		};
		if (advancementIndex === null) {
			return;
		}
		const newAdvancements = {
			...character.advancements,
			[advancementIndex]: true,
		};
		updateGameState({
			players: gameState.players.map((player) =>
				player.character && player.id === id
					? {
							...player,
							character: {
								...character,
								moves: [...existingMoves, newMove],
								advancements: newAdvancements,
							},
						}
					: player,
			),
		});
		closeModal();
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
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
			<ConfirmChoice onClick={handleSubmit(onSubmit)} />
		</form>
	);
}

function UnmarkAspects({
	character,
	closeModal,
	advancementIndex,
}: {
	character: Character;
	closeModal: () => void;
	advancementIndex: number | null;
}) {
	const { gameState, updateGameState } = useGame();
	const markedAspects =
		gameState.players.find((player) => player.id === character.playerId)
			?.character?.relicAspects ?? [];
	const numberMarked =
		markedAspects.filter((aspect) => aspect === 1).length || 0;

	const playbook = playbookBases[character.playbook];

	const onConfirm = () => {
		if (advancementIndex === null) {
			return;
		}
		const newAdvancements = {
			...character.advancements,
			[advancementIndex]: true,
		};
		const newAspects = constructAspectArray(playbook.relics);
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: {
								...character,
								relicAspects: newAspects,
								advancements: newAdvancements,
							},
						}
					: player,
			),
		});
		closeModal();
	};

	return (
		<div>
			<div className="h-12" />
			<h2 className="text-xl font-bold text-center text-theme-text-accent">
				Unmark Aspects
			</h2>
			<div className="h-6" />
			<p>This will unmark {numberMarked} Aspects across all of your Relics.</p>
			<div className="h-6" />
			<ConfirmChoice onClick={onConfirm} />
		</div>
	);
}

function AdjustStats({
	character,
	closeModal,
	cinderVersion,
	advancementIndex,
}: {
	character: Character;
	closeModal: () => void;
	cinderVersion: boolean;
	advancementIndex: number | null;
}) {
	const currentStats = cinderVersion
		? { ...character.abilities, cinder: character.abilities.cinder + 1 }
		: character.abilities;
	const { updateGameState, gameState } = useGame();

	const { register, handleSubmit } = useForm({
		defaultValues: {
			vitality: currentStats.vitality,
			composure: currentStats.composure,
			reason: currentStats.reason,
			presence: currentStats.presence,
			cinder: currentStats.cinder,
		},
	});

	const onSubmit = (data: { [key in keyof Abilities]: number }) => {
		if (advancementIndex === null) {
			return;
		}
		const newAdvancements = {
			...character.advancements,
			[advancementIndex]: true,
		};
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: {
								...character,
								abilities: data,
								advancements: newAdvancements,
							},
						}
					: player,
			),
		});
		closeModal();
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2 className="text-center">
				{cinderVersion ? "Add 1 to Cinder" : "Add 1 to Any Ability"}
			</h2>

			{cinderVersion && (
				<p className="text-center text-theme-text-muted">
					Your Ability scores will be updated as follows:
				</p>
			)}

			<div className="flex justify-center w-full my-4">
				<div className="grid grid-cols-5 gap-1">
					{orderAbilities(currentStats).map(({ ability, value }) => (
						<div key={ability} className="flex flex-col gap-1">
							<label htmlFor={ability} className="flex flex-col gap-1">
								<span className="text-sm text-theme-text-muted text-center">
									{ability}
								</span>
							</label>
							<input
								id={ability}
								type="number"
								defaultValue={value}
								disabled={cinderVersion}
								{...register(ability, { valueAsNumber: true })}
								className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
							/>
						</div>
					))}
				</div>
			</div>
			<ConfirmChoice onClick={handleSubmit(onSubmit)} />
		</form>
	);
}
