import { AnimatePresence } from "framer-motion";
import { Dialog, Tooltip } from "radix-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { DominionMysteries } from "../mystery/content/dominion";
import type { Dominion } from "../mystery/types";
import { parseStaticText } from "../playbooks/utils";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { Section } from "../shared/Section";
import { StyledTooltip } from "../shared/Tooltip";
import { ReactComponent as CrownIcon } from "./crown.svg";

export function DominionSheet({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const {
		gameState,
		user: { role },
	} = useGame();
	const dominionMystery = gameState.dominion;
	const [modalOpen, setModalOpen] = useState(false);
	if (!dominionMystery && role !== PlayerRole.KEEPER) return null;

	const { title, intro, servants, layers } = dominionMystery
		? DominionMysteries[dominionMystery.title as keyof typeof DominionMysteries]
		: { title: "Dominion", intro: [], servants: [], layers: [] };
	return (
		<div className="flex flex-col justify-start items-start h-full w-full pointer-events-none">
			{(dominionMystery || role === PlayerRole.KEEPER) && (
				<Tooltip.Root>
					<Tooltip.Trigger asChild>
						<button
							type="button"
							aria-label="Open Lord Question & Clues"
							className="drawerButton"
							onClick={() => setIsOpen(!isOpen)}
						>
							<CrownIcon className="w-full h-full" />
						</button>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content className="z-30 pl-1" side="right">
							<StyledTooltip>Lord Question & Clues</StyledTooltip>
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			)}
			<AnimatePresence>
				{isOpen && (
					<div>
						{dominionMystery ? (
							<BorderedTray>
								<CloseTrayButton close={() => setIsOpen(!isOpen)} />
								<h1 className="text-2xl font-bold text-theme-text-accent mb-10">
									{title}
								</h1>
								<div className="h-full overflow-y-auto">
									<div className="flex flex-col gap-10">
										<Section
											title="Introduction"
											collapsible
											leftAlign
											withDecoration
										>
											{intro.map((i) => (
												<p
													key={i}
													className="text-left leading-relaxed text-sm"
												>
													{parseStaticText(i)}
												</p>
											))}
										</Section>

										<div className="flex flex-col gap-10">
											<div>
												{dominionMystery?.questions?.map((q) => (
													<div key={q.text}>
														<h2 className="text-lg font-bold text-theme-text-accent">
															{q.text}
														</h2>
														<p className="text-sm text-theme-text-secondary italic">
															(Complexity: {q.complexity})
														</p>
													</div>
												))}
											</div>
										</div>
										<ClueSection
											dominion={
												dominionMystery.title as keyof typeof DominionMysteries
											}
											role={role}
										/>
										{role === PlayerRole.KEEPER && (
											<div className="flex flex-col gap-2 mt-8 border border-theme-border-accent rounded-lg p-4 overflow-y-auto">
												<h2 className="text-xl font-bold text-theme-text-accent">
													Keeper Materials
												</h2>
												<p className="text-sm text-theme-text-secondary italic">
													Not visible to Embers.
												</p>
												<Section title="Layers" collapsible={true}>
													{layers.map((l) => (
														<Section
															title={l.title}
															collapsible={true}
															minify={true}
															key={l.title}
														>
															{l.text.map((t) => (
																<p
																	key={t}
																	className="text-left leading-relaxed"
																>
																	{parseStaticText(t)}
																</p>
															))}
														</Section>
													))}
												</Section>
												<Section title="Servants" collapsible={true}>
													{servants.map((s) => (
														<div key={s.title}>
															<h2 className="text-lg font-bold text-theme-text-accent">
																{s.title}
															</h2>
															{s.description.map((d) => (
																<p
																	key={d}
																	className="text-left leading-relaxed"
																>
																	{parseStaticText(d)}
																</p>
															))}
															{s.quotes.length > 0 && (
																<h3 className="text-lg font-bold text-theme-text-accent">
																	Quotes
																</h3>
															)}
															{s.quotes.map((q) => (
																<p
																	key={q}
																	className="text-left leading-relaxed italic"
																>
																	&ldquo;{parseStaticText(q)}&rdquo;
																</p>
															))}
														</div>
													))}
												</Section>
												<Dialog.Root
													open={modalOpen}
													onOpenChange={setModalOpen}
												>
													<Dialog.Trigger className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100">
														Change Dominion
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
																Change Dominion
															</Dialog.Title>
															<Dialog.Description className="DialogDescription">
																There can only be one active dominion at a time.
																Selecting a new dominion will replace the
																current one, including active clues. You can
																also remove the dominion without selecting a new
																one.
															</Dialog.Description>
															<DominionMysteryForm setIsOpen={setModalOpen} />
														</Dialog.Content>
													</Dialog.Portal>
												</Dialog.Root>
											</div>
										)}
									</div>
								</div>
							</BorderedTray>
						) : (
							<BorderedTray>
								<CloseTrayButton close={() => setIsOpen(!isOpen)} />
								<h1 className="text-2xl font-bold text-theme-text-accent mb-10">
									{title}
								</h1>
								<div className="h-full overflow-y-auto">
									<div className="text-lg text-theme-text-secondary text-center my-10">
										No active dominion. You can add one below.
									</div>
									{role === PlayerRole.KEEPER && (
										<Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
											<Dialog.Trigger className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100">
												Change Dominion
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
														Change Dominion
													</Dialog.Title>
													<Dialog.Description className="DialogDescription">
														There can only be one active dominion at a time.
														Selecting a new dominion will replace the current
														one, including active clues. You can also remove the
														dominion without selecting a new one.
													</Dialog.Description>
													<DominionMysteryForm setIsOpen={setModalOpen} />
												</Dialog.Content>
											</Dialog.Portal>
										</Dialog.Root>
									)}
								</div>
							</BorderedTray>
						)}
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}

function DominionMysteryForm({
	setIsOpen,
}: {
	setIsOpen: (isOpen: boolean) => void;
}) {
	const { register, handleSubmit } = useForm<{
		title: keyof typeof DominionMysteries;
	}>();
	const { updateGameState } = useGame();

	const onSubmit = (data: { title: keyof typeof DominionMysteries }) => {
		const dominionContent = DominionMysteries[data.title];
		if (!dominionContent) {
			toast.error(`Something went wrong; dominion ${data.title} not found.`);
			return;
		}
		const newDominion: Dominion = {
			title: data.title,
			questions: dominionContent.questionsAndOpportunities.map((q) => ({
				text: q.question,
				complexity: q.complexity,
				opportunity: q.opportunity,
				result: null,
			})),
			clues: dominionContent.clues.map((c) => ({
				text: c,
				earned: false,
				explained: false,
				removed: false,
			})),
		};
		updateGameState({
			dominion: newDominion,
		});
		toast.success(`Dominion changed to ${dominionContent.title}`);
		setIsOpen(false);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex gap-2 items-center justify-start my-4">
				<input type="radio" {...register("title")} value="noxilliax" />
				<label htmlFor="title">
					Noxilliax, The Emerald Nightmare (The Great Forest)
				</label>
			</div>
			<div className="w-full flex gap-2 items-center justify-center">
				<button
					type="submit"
					className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
				>
					Confirm
				</button>
				<button
					type="button"
					className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
					onClick={() => {
						updateGameState({ dominion: null });
					}}
				>
					Remove Dominion
				</button>
			</div>
		</form>
	);
}

//Consider DRY up with Mystery ClueSection
function ClueSection({
	dominion,
	role,
}: {
	dominion: keyof typeof DominionMysteries;
	role: PlayerRole;
}) {
	const { updateGameState, gameState } = useGame();
	const { register, handleSubmit, reset } = useForm<{ customClue: string }>();
	const { dominion: dominionState } = gameState;
	if (!dominionState) return null;
	const earnedClues = dominionState.clues?.filter((clue) => clue.earned);

	const availableCanonicalClues = DominionMysteries[dominion].clues.filter(
		(clue) => !earnedClues?.some((c) => c.text === clue),
	);

	const addCustomClue = (data: { customClue: string }) => {
		const newClues = dominionState.clues
			? [
					...dominionState.clues,
					{
						text: data.customClue.trim(),
						earned: true,
						explained: false,
						removed: false,
					},
				]
			: [
					{
						text: data.customClue.trim(),
						earned: true,
						explained: false,
						removed: false,
					},
				];
		updateGameState({
			dominion: {
				...dominionState,
				clues: newClues,
			},
		});
		reset();
	};

	const earnClue = (clue: string, checked: boolean) => {
		const existingClue = dominionState.clues?.find((c) => c.text === clue);
		const newClues =
			existingClue && dominionState.clues
				? dominionState.clues.map((c) =>
						c.text === clue ? { ...c, earned: checked, removed: false } : c,
					)
				: [
						...(dominionState.clues ?? []),
						{ text: clue, earned: checked, explained: false, removed: false },
					];
		updateGameState({
			dominion: {
				...dominionState,
				clues: newClues,
			},
		});
	};

	const explainClue = (clue: string, checked: boolean) => {
		const newClues = dominionState.clues?.map((c) =>
			c.text === clue ? { ...c, explained: checked, removed: false } : c,
		) ?? [{ text: clue, earned: true, explained: checked, removed: false }];
		updateGameState({
			dominion: {
				...dominionState,
				clues: newClues,
			},
		});
	};

	const removeClue = (clue: string) => {
		const newClues = dominionState.clues?.map((c) =>
			c.text === clue ? { ...c, earned: false, removed: true } : c,
		) ?? [{ text: clue, earned: false, explained: false, removed: true }];
		updateGameState({
			dominion: {
				...dominionState,
				clues: newClues,
			},
		});
	};

	return (
		<Section title="Clues">
			<div className="flex gap-2 text-sm text-theme-text-secondary text-left justify-center items-center">
				<div>Earned: {earnedClues?.length}</div> <div>|</div>
				<div>
					{" "}
					Explained: {earnedClues?.filter((clue) => clue.explained).length}
				</div>
				<div>|</div>{" "}
				<div>
					{" "}
					Remaining: {earnedClues?.filter((clue) => !clue.explained).length}
				</div>
			</div>
			<div className="flex flex-col justify-start items-start text-left gap-2 w-full">
				<div
					key={"header-row"}
					className="grid grid-cols-[20px_20px_20px_1fr] gap-4 text-xs whitespace-nowrap overflow-ellipsis w-full"
				>
					<span className="text-left -rotate-45">Earned</span>
					<span className="text-left -rotate-45">Explained</span>
					<span className="text-left -rotate-45">Remove</span>
					<span></span>
				</div>
				{earnedClues && earnedClues.length > 0 ? (
					earnedClues.map((clue) => (
						<div
							key={clue.text}
							className="grid grid-cols-[20px_20px__20px_1fr] gap-2 items-center w-full"
						>
							<input
								type="checkbox"
								checked={clue.earned}
								disabled={role !== PlayerRole.KEEPER}
								onChange={(e) => earnClue(clue.text, e.target.checked)}
							/>
							<input
								type="checkbox"
								checked={clue.explained}
								onChange={(e) => explainClue(clue.text, e.target.checked)}
							/>
							<button
								type="button"
								className="text-xs text-theme-text-secondary bg-theme-bg-primary rounded-full px-0 aspect-square hover:bg-theme-bg-accent hover:text-theme-text-accent hover:border hover:border-theme-border-accent"
								onClick={() => removeClue(clue.text)}
							>
								X
							</button>
							<span className="text-left">{clue.text}</span>
						</div>
					))
				) : (
					<div className="text-sm text-theme-text-muted italic w-full text-center">
						No clues yet
					</div>
				)}
			</div>
			{role === PlayerRole.KEEPER && (
				<div className="flex flex-col gap-2 w-full ">
					<Section title="Available Clues" collapsible={true} minify={true}>
						<span className="text-sm italic text-theme-text-secondary text-left">
							Unearned clue lists are only visible to the Keeper. Custom clues
							can be added by any player.
						</span>
						<div className="grid grid-cols-2 gap-2">
							{availableCanonicalClues?.map((clue) => (
								<div
									key={clue}
									className="flex gap-2 items-start justify-start text-left text-sm"
								>
									<input
										type="checkbox"
										onChange={(e) => earnClue(clue, e.target.checked)}
									/>
									{clue}
								</div>
							))}
						</div>
					</Section>
				</div>
			)}
			<form
				onSubmit={handleSubmit(addCustomClue)}
				className="flex gap-2 w-full"
			>
				<input
					type="text"
					placeholder="Add custom clue..."
					className="flex-grow"
					{...register("customClue")}
				/>
				<button
					type="submit"
					className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
				>
					Add
				</button>
			</form>
		</Section>
	);
}
