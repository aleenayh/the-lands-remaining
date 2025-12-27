import { useForm } from "react-hook-form";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { Section } from "../playbooks/sharedComponents/Section";
import { lookupMystery } from "./content";
import { themeElements } from "./themes";
import type { Mystery } from "./types";

export function Countdown({ mystery }: { mystery: Mystery }) {
	const {
		user: { role },
		gameState,
		updateGameState,
	} = useGame();
	const { initialColor, filledColor, textColors } =
		themeElements[mystery.theme];
	const localTheme = localStorage.getItem("theme") || "forest";
	const useHighContrastDark = localTheme === "dark";
	const useHighContrastLight = localTheme === "light";
	const gradient = textColors
		? `linear-gradient(to bottom, hsl(${textColors.top.h}, ${textColors.top.s}%, ${textColors.top.l}%), hsl(${textColors.bottom.h}, ${textColors.bottom.s}%, ${textColors.bottom.l}%))`
		: `linear-gradient(to bottom, hsl(${initialColor.h}, ${initialColor.s}%, ${initialColor.l}%), hsl(${filledColor.h}, ${filledColor.s}%, ${filledColor.l}%))`;

	const onToggle = (checked: boolean) => {
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.title === mystery.title
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
			mysteries: gameState.mysteries.filter((m) => m.title !== mystery.title),
		});
	};

	const style = useHighContrastDark
		? {
				color: "#fff",
			}
		: useHighContrastLight
			? {
					color: "#000",
				}
			: {
					background: gradient,
					backgroundClip: "text",
					color: "transparent",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
				};

	const { intro, clues } = lookupMystery(mystery.title) ?? {
		intro: [],
		clues: [],
	};
	return (
		<div>
			<h1 className="text-xl text-center mb-2 whitespace-nowrap" style={style}>
				{mystery.title}
			</h1>
			{intro && intro.length > 0 && (
				<Section title="Introduction" collapsible={true} minify={true}>
					<div className="text-sm text-left">
						{intro?.map((line) => (
							<p key={line}>{line}</p>
						))}
					</div>
				</Section>
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
					<h2 className="text-md text-center whitespace-nowrap" style={style}>
						Questions
					</h2>
					{mystery.questions.map((question) => (
						<div key={question.text}>
							<div className="flex gap-2 justify-start items-center">
								{question.text}{" "}
								<span className="text-sm text-theme-text-secondary italic">
									(Complexity: {question.complexity})
								</span>
							</div>
							<div className="text-sm text-theme-text-secondary text-left">
								<span className="italic">Opportunity:</span>{" "}
								{question.opportunity}
							</div>
						</div>
					))}
				</div>
			)}
			<ClueSection clues={clues} mystery={mystery} role={role} />
			{role === PlayerRole.KEEPER && (
				<button
					type="button"
					onClick={onRemove}
					className="my-2 bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
				>
					Remove this mystery
				</button>
			)}
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
	const { icon, initialColor, filledColor } = themeElements[theme];
	const yOffset = index % 2 === 0 ? -5 : 20;
	const rotation = index * 30;
	return (
		<div
			style={{ transform: `translateY(${yOffset}px) rotate(${rotation}deg)` }}
		>
			<div
				className="w-10 h-10 bg-theme-bg-secondary rounded-full"
				style={{
					color: `${filled ? `hsl(${filledColor.h}, ${filledColor.s}%, ${filledColor.l}%)` : `hsl(${initialColor.h}, ${initialColor.s}%, ${initialColor.l}%)`}`,
				}}
			>
				{icon}
			</div>
		</div>
	);
}

function ClueSection({
	clues,
	mystery,
	role,
}: {
	clues: string[];
	mystery: Mystery;
	role: PlayerRole;
}) {
	const { updateGameState, gameState } = useGame();
	const earnedClues = mystery.clues?.filter((clue) => clue.earned);
	const { register, handleSubmit, reset } = useForm<{ customClue: string }>();

	const availableCanonicalClues = clues.filter(
		(clue) => !earnedClues?.some((c) => c.text === clue),
	);

	const addCustomClue = (data: { customClue: string }) => {
		const newClues = mystery.clues
			? [
					...mystery.clues,
					{ text: data.customClue.trim(), earned: true, explained: false },
				]
			: [{ text: data.customClue.trim(), earned: true, explained: false }];
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.title === mystery.title ? { ...m, clues: [...newClues] } : m,
			),
		});
		reset();
	};

	const earnClue = (clue: string, checked: boolean) => {
		const existingClue = mystery.clues?.find((c) => c.text === clue);
		const newClues =
			existingClue && mystery.clues
				? mystery.clues.map((c) =>
						c.text === clue ? { ...c, earned: checked } : c,
					)
				: [
						...(mystery.clues ?? []),
						{ text: clue, earned: checked, explained: false },
					];
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.title === mystery.title
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
			c.text === clue ? { ...c, explained: checked } : c,
		) ?? [{ text: clue, earned: true, explained: checked }];
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.title === mystery.title ? { ...m, clues: [...newClues] } : m,
			),
		});
	};

	return (
		<Section title="Clues" collapsible={true} minify={true}>
			<h3 className="text-sm text-theme-text-primary text-center">
				Earned Clues
			</h3>
			<div className="flex gap-2 text-sm text-theme-text-secondary text-left justify-center items-center">
				<div>Earned: {earnedClues?.length}</div>
				<div>
					{" "}
					Explained: {earnedClues?.filter((clue) => clue.explained).length}
				</div>
			</div>
			<div className="flex flex-col justify-start items-start text-left gap-2 w-full">
				{earnedClues && earnedClues.length > 0 ? (
					earnedClues?.map((clue) => (
						<div
							key={clue.text}
							className="grid grid-cols-[20px_20px_1fr] gap-4 items-center w-full"
						>
							<input
								type="checkbox"
								checked={clue.earned}
								onChange={(e) => earnClue(clue.text, e.target.checked)}
							/>
							<input
								type="checkbox"
								checked={clue.explained}
								onChange={(e) => explainClue(clue.text, e.target.checked)}
							/>
							<span className="text-left">{clue.text}</span>
						</div>
					))
				) : (
					<div className="col-span-3 text-sm text-theme-text-muted italic text-left">
						No clues yet
					</div>
				)}
			</div>
			{role === PlayerRole.KEEPER && (
				<div className="flex flex-col gap-2 w-full ">
					<h3 className="text-sm text-theme-text-primary text-center">
						Available Clues
					</h3>
					<span className="text-sm italic text-theme-text-secondary text-left">
						Unearned clue lists are only visible to the Keeper, and only
						populated for canonical mysteries. Custom clues can be added by any
						player, for any mystery.
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
