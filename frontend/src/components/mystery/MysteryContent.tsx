import { Dialog, Tooltip } from "radix-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { AnswerQuestionDiceRollModal } from "../shared/Dice";
import { Divider } from "../shared/Divider";
import { GlassyButton } from "../shared/GlassyButton";
import { Section } from "../shared/Section";
import { StyledTooltip } from "../shared/Tooltip";
import { EditMystery } from "./AddMystery";
import { themeElements } from "./themes";
import type { Mystery } from "./types";

export function MysteryContent({ mystery }: { mystery: Mystery }) {
	const {
		user: { role },
		gameState,
		updateGameState,
	} = useGame();
	const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
	const [questionToResolve, setQuestionToResolve] = useState<string | null>(
		null,
	);

	const onToggle = (checked: boolean) => {
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.id === mystery.id
					? {
							...m,
							countdownCurrent: checked
								? m.countdownCurrent + 1
								: m.countdownCurrent - 1,
						}
					: m,
			),
		});
	};
	const onRemove = () => {
		updateGameState({
			mysteries: gameState.mysteries.filter((m) => m.id !== mystery.id),
		});
	};
	const openConfirmationModal = (question: string) => {
		setQuestionToResolve(question);
		setConfirmationModalOpen(true);
	};

	const resolveQuestion = (question: string | null) => {
		if (!question) {
			toast.error("Something went wrong!");
			return;
		}
		const newClues = mystery.clues
			? mystery.clues.map((c) =>
					c.explained
						? { ...c, earned: false, explained: false, removed: true }
						: c,
				)
			: [{ text: question, earned: false, explained: false, removed: true }];
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.id === mystery.id
					? {
							...m,
							questions: m.questions?.filter((q) => q.text !== question),
							clues: [...newClues],
						}
					: m,
			),
		});
		setConfirmationModalOpen(false);
		setQuestionToResolve(null);
		toast.success(`Resolved: ${question}`);
	};

	const intro = mystery.intro ?? [];
	return (
		<div className="flex flex-col gap-0 py-4 w-full">
			{intro.length > 0 ? (
				<Section title={mystery.title} collapsible withDecoration leftAlign>
					<div className="text-sm text-left flex flex-col gap-2">
						{intro?.map((line) => (
							<p key={line}>{line}</p>
						))}
					</div>
				</Section>
			) : (
				<h2 className={`font-bold text-left text-theme-text-accent text-lg`}>
					{mystery.title}
				</h2>
			)}
			{role === PlayerRole.KEEPER && (
				<div className="my-2 flex gap-2 justify-center items-center">
					<Tooltip.Root>
						<Tooltip.Trigger>
							<button
								type="button"
								onClick={onRemove}
								className="border border-theme-border bg-theme-bg-primary hover:bg-theme-bg-accent px-2 py-1 rounded-lg text-sm text-theme-text-secondary hover:text-theme-text-primary"
							>
								Remove this mystery
							</button>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<StyledTooltip>
								Remove the mystery from game tracking.
							</StyledTooltip>
						</Tooltip.Content>
					</Tooltip.Root>
					<EditMystery mystery={mystery} />
				</div>
			)}
			{mystery.countdownTotal > 0 && (
				<div>
					<div
						className={`flex gap-3 min-h-[100px] justify-center items-center mx-auto`}
					>
						{Array.from({ length: mystery.countdownTotal }).map((_, index) => (
							<CountdownItem
								key={`mc-${mystery.title}-${index}`}
								theme={mystery.theme}
								index={index}
								filled={mystery.countdownCurrent > index}
							/>
						))}
					</div>
					{role === PlayerRole.KEEPER && (
						<div className="flex gap-3 justify-center items-center">
							{Array.from({ length: mystery.countdownTotal }).map(
								(_, index) => (
									<input
										type="checkbox"
										key={`mc-${mystery.title}-${index}`}
										defaultChecked={mystery.countdownCurrent > index}
										onChange={(e) => onToggle(e.target.checked)}
									/>
								),
							)}
						</div>
					)}
					<div className="text-theme-text-secondary text-sm">
						{mystery.countdownCurrent} / {mystery.countdownTotal}
					</div>
				</div>
			)}
			{mystery.questions && mystery.questions.length > 0 && (
				<div className="py-4 flex flex-col gap-2">
					<h2 className="text-md text-center whitespace-nowrap text-theme-text-primary">
						Questions
					</h2>
					{mystery.questions.map((question) => (
						<div key={question.text}>
							<div className="inline-flex gap-2 justify-start items-center w-full flex-wrap text-left whitespace-break-spaces leading-none">
								{question.text}{" "}
								<span className="text-sm text-theme-text-secondary italic">
									(Complexity: {question.complexity})
								</span>
								{question.result && (
									<span className="text-sm text-theme-text-secondary font-bold">
										Result: {question.result}
									</span>
								)}
								<AnswerQuestionDiceRollModal
									mystery={mystery}
									question={question}
								/>
							</div>
							{question.opportunity && (
								<div className="ml-2 border-l-2 px-4 border-theme-border text-sm leading-tight text-theme-text-secondary text-left">
									<span className="italic">Opportunity:</span>{" "}
									{question.opportunity}
								</div>
							)}
							{role === PlayerRole.KEEPER && (
								<div className="flex flex-col gap-2 justify-center items-center">
									<Tooltip.Root>
										<Tooltip.Trigger>
											<button
												type="button"
												className="border border-theme-border bg-theme-bg-primary hover:bg-theme-bg-accent px-2 py-1 rounded-lg text-sm text-theme-text-secondary hover:text-theme-text-primary"
												onClick={() => openConfirmationModal(question.text)}
											>
												Resolve Question
											</button>
										</Tooltip.Trigger>
										<Tooltip.Content>
											<StyledTooltip>
												Resolving a Question automatically clears all clues
												marked "explained." If the Mystery has only one
												Question, you can skip this and instead Issue Rewards.
											</StyledTooltip>
										</Tooltip.Content>
									</Tooltip.Root>
								</div>
							)}
						</div>
					))}
				</div>
			)}
			<ClueSection mystery={mystery} />
			<Divider />
			<Dialog.Root
				open={confirmationModalOpen}
				onOpenChange={setConfirmationModalOpen}
			>
				<Dialog.Portal>
					<Dialog.Overlay className="DialogOverlay" />
					<Dialog.Content className="DialogContent" style={{ zIndex: 30 }}>
						<Dialog.Close asChild>
							<button
								type="button"
								className="absolute top-2 right-2 aspect-square w-8 h-8 bg-theme-bg-accent text-theme-text-primary rounded-full flex justify-center items-center"
							>
								X
							</button>
						</Dialog.Close>
						<Dialog.Title className="DialogTitle">
							Resolve Question
						</Dialog.Title>
						<Dialog.Description className="DialogDescription italic">
							{questionToResolve}
						</Dialog.Description>
						<div className="text-sm text-theme-text-muted">
							This will clear all clues marked "explained", listed below, as
							well as the question itself. Other clues will remain for use in
							subsequent questions.
						</div>
						<ul className="flex flex-col ml-4 list-disc list-inside text-sm">
							{mystery.clues
								?.filter((clue) => clue.explained)
								.map((clue) => (
									<li key={clue.text}>{clue.text}</li>
								))}
						</ul>
						<div className="flex justify-center items-center">
							<button
								type="button"
								className="text-theme-text-primary bg-theme-bg-primary hover:bg-theme-bg-accent border border-theme-border-accent rounded-lg p-1"
								onClick={() => resolveQuestion(questionToResolve)}
							>
								Confirm
							</button>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
}

export function CountdownItem({
	theme,
	index,
	filled,
}: {
	theme: keyof typeof themeElements;
	index: number;
	filled: boolean;
}) {
	const { icon } = themeElements[theme];
	const yOffset = index % 2 === 0 ? -5 : 20;
	const rotation = index * 30;
	return (
		<div
			style={{ transform: `translateY(${yOffset}px) rotate(${rotation}deg)` }}
		>
			<div
				className={`w-10 h-10 bg-theme-bg-secondary rounded-full ${filled ? `text-theme-text-accent` : `text-theme-bg-accent`}`}
			>
				{icon}
			</div>
		</div>
	);
}

function ClueSection({ mystery }: { mystery: Mystery }) {
	const { updateGameState, gameState } = useGame();
	const earnedClues = mystery.clues?.filter((clue) => clue.earned);
	const { register, handleSubmit, reset } = useForm<{ customClue: string }>();

	const addCustomClue = (data: { customClue: string }) => {
		const newClues = mystery.clues
			? [
					...mystery.clues,
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
			mysteries: gameState.mysteries.map((m) =>
				m.id === mystery.id ? { ...m, clues: [...newClues] } : m,
			),
		});
		reset();
	};

	const explainClue = (clue: string, checked: boolean) => {
		const newClues = mystery.clues?.map((c) =>
			c.text === clue ? { ...c, explained: checked, removed: false } : c,
		) ?? [{ text: clue, earned: true, explained: checked, removed: false }];
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.id === mystery.id ? { ...m, clues: [...newClues] } : m,
			),
		});
	};

	const removeClue = (clue: string) => {
		const newClues = mystery.clues?.map((c) =>
			c.text === clue
				? { ...c, earned: false, explained: false, removed: true }
				: c,
		) ?? [{ text: clue, earned: false, explained: false, removed: true }];

		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.id === mystery.id ? { ...m, clues: [...newClues] } : m,
			),
		});
	};

	return (
		<Section title="Clues">
			<div className="flex gap-2 text-sm text-theme-text-muted text-left justify-center items-center">
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
					className="hidden md:grid grid-cols-[20px_20px_1fr] gap-4 text-xs whitespace-nowrap overflow-ellipsis items-center w-full"
				>
					<span className="text-left -rotate-45">Explained</span>
					<span className="text-left -rotate-45">Remove</span>
					<span></span>
				</div>
				{earnedClues && earnedClues.length > 0 ? (
					earnedClues.map((clue) => (
						<div
							key={clue.text}
							className="grid grid-cols-[20px_20px_1fr] gap-2 items-center w-full"
						>
							<input
								type="checkbox"
								checked={clue.explained}
								onChange={(e) => explainClue(clue.text, e.target.checked)}
							/>
							<button
								type="button"
								className="text-xs text-theme-text-muted bg-theme-bg-primary rounded-full px-0 aspect-square hover:bg-theme-bg-accent hover:text-theme-text-accent hover:border hover:border-theme-border-accent"
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

			<form
				onSubmit={handleSubmit(addCustomClue)}
				className="flex gap-2 w-full"
			>
				<input
					type="text"
					placeholder="Add clue..."
					className="flex-grow"
					{...register("customClue")}
				/>
				<GlassyButton onClick={handleSubmit(addCustomClue)}>Add</GlassyButton>
			</form>
		</Section>
	);
}
