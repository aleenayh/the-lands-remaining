import { Tooltip } from "radix-ui";
import { useForm } from "react-hook-form";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { AnswerQuestionDiceRollModal } from "../shared/Dice";
import { Divider } from "../shared/Divider";
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

	const resolveQuestion = (question: string) => {
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
							<div className="flex gap-2 justify-start items-center w-full flex-wrap ">
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
												onClick={() => resolveQuestion(question.text)}
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
			<ClueSection mystery={mystery} role={role} />
			<Divider />
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

function ClueSection({
	mystery,
	role,
}: {
	mystery: Mystery;
	role: PlayerRole;
}) {
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

	const earnClue = (clue: string, checked: boolean) => {
		const existingClue = mystery.clues?.find((c) => c.text === clue);
		const newClues =
			existingClue && mystery.clues
				? mystery.clues.map((c) =>
						c.text === clue ? { ...c, earned: checked, removed: false } : c,
					)
				: [
						...(mystery.clues ?? []),
						{ text: clue, earned: checked, explained: false, removed: false },
					];
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.id === mystery.id
					? {
							...m,
							clues: [...newClues],
						}
					: m,
			),
		});
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
					className="grid grid-cols-[20px_20px_20px_1fr] gap-4 text-xs whitespace-nowrap overflow-ellipsis items-center w-full"
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
							className="grid grid-cols-[20px_20px_20px_1fr] gap-2 items-center w-full"
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
