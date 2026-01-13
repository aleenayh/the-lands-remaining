import { Dialog, Tooltip } from "radix-ui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ReactComponent as CopyIcon } from "../../components/settings/copy.svg";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { Section } from "../playbooks/sharedComponents/Section";
import { StyledTooltip } from "../shared/Tooltip";
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
				m.title === mystery.title
					? {
							...m,
							questions: m.questions?.filter((q) => q.text !== question),
							clues: [...newClues],
						}
					: m,
			),
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
		<Dialog.Root>
			<div className="flex flex-col gap-0">
				<h1 className="text-xl text-center whitespace-nowrap" style={style}>
					{mystery.title}
				</h1>
				{role === PlayerRole.KEEPER && (
					<div className="flex gap-2 justify-center items-center">
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
									Remove the mystery without claiming a Supplicant. If your
									Embers resolved the mystery, use Issue Rewards instead.
								</StyledTooltip>
							</Tooltip.Content>
						</Tooltip.Root>
						<Dialog.Trigger className="border border-theme-border bg-theme-bg-primary hover:bg-theme-bg-accent px-2 py-1 rounded-lg text-sm text-theme-text-secondary hover:text-theme-text-primary">
							Issue Rewards
						</Dialog.Trigger>
					</div>
				)}
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
							{Array.from({ length: mystery.countdownTotal }).map(
								(_, index) => (
									<CountdownItem
										key={`mc-${mystery.title}-${index}`}
										theme={mystery.theme}
										index={index}
										filled={mystery.countdownCurrent > index}
									/>
								),
							)}
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
								{question.opportunity && (
									<div className="text-sm text-theme-text-secondary text-left">
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
				<ClueSection clues={clues} mystery={mystery} role={role} />
			</div>
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
						Rewards for {mystery.title}
					</Dialog.Title>
					<Dialog.Description className="DialogDescription">
						Rewards for resolving the mystery.
					</Dialog.Description>
					<RewardForm mystery={mystery} onRemove={onRemove} />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
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
	const removedClues = mystery.clues?.filter((clue) => clue.removed);
	const { register, handleSubmit, reset } = useForm<{ customClue: string }>();

	const availableCanonicalClues = clues.filter(
		(clue) =>
			!earnedClues?.some((c) => c.text === clue) &&
			!removedClues?.some((c) => c.text === clue),
	);

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
						c.text === clue ? { ...c, earned: checked, removed: false } : c,
					)
				: [
						...(mystery.clues ?? []),
						{ text: clue, earned: checked, explained: false, removed: false },
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
			c.text === clue ? { ...c, explained: checked, removed: false } : c,
		) ?? [{ text: clue, earned: true, explained: checked, removed: false }];
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.title === mystery.title ? { ...m, clues: [...newClues] } : m,
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

function RewardForm({
	mystery,
	onRemove,
}: {
	mystery: Mystery;
	onRemove: () => void;
}) {
	const { register, handleSubmit } = useForm<{ supplicant: string }>();
	const { updateGameState, gameState } = useGame();

	const onSubmit = (data: { supplicant: string }) => {
		updateGameState({
			supplicants: [...(gameState.supplicants ?? []), data.supplicant],
		});
		toast.success(`Supplicant chosen: ${data.supplicant}`);
	};

	const rewards = lookupMystery(mystery.title)?.rewards;
	if (!rewards) {
		return <div>No rewards found for {mystery.title}.</div>;
	}

	const allItems = rewards.items.join("\n\n");
	const copyToClipboard = () => {
		navigator.clipboard.writeText(allItems);
		toast.success("Copied to clipboard");
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-2 justify-start items-center"
		>
			<div className="flex flex-col gap-2">
				First, as a group, choose a Side Character to become a Supplicant:
			</div>

			{Object.keys(rewards.supplicants).map((supplicant) => (
				<div key={supplicant} className="flex flex-col gap-2 items-center">
					<div className="w-full flex gap-2 items-center justify-start">
						<input
							type="radio"
							{...register("supplicant")}
							value={supplicant}
						/>
						<label key={supplicant} htmlFor={supplicant}>
							{supplicant}
						</label>
					</div>
					<div className="ml-4 text-sm text-theme-text-secondary text-left">
						{rewards.supplicants[supplicant]}
					</div>
				</div>
			))}
			<button
				type="submit"
				className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
			>
				Confirm Supplicant
			</button>

			<div className="flex flex-col gap-0">
				<p>Then, each Ember chooses one.</p>
				<p className="text-sm text-theme-text-secondary text-left italic">
					{" "}
					(Pre-formatted. Click button to copy and Embers can paste directly
					into their 'Add equipment' form.)
				</p>
			</div>
			<button
				type="button"
				className="bg-theme-bg-accent border-2 border-theme-border-accent hover:bg-theme-bg-accent transition-colors flex justify-center items-center rounded-lg p-2 gap-2"
				onClick={copyToClipboard}
			>
				<CopyIcon className="w-4 h-4" />
			</button>
			<textarea
				value={rewards.items.join("\n\n")}
				readOnly
				className="mx-2 p-2 h-40 w-full box-border"
			/>

			{rewards.special && rewards.special.length > 0 && (
				<div className="flex flex-col gap-2">
					<h3 className="text-sm text-theme-text-primary text-center">
						Special Rewards
					</h3>
					{rewards.special.map((special) => (
						<div key={special.condition}>
							<div>{special.condition}</div>
							{special.rewards.map((reward) => (
								<div key={reward} className="ml-4 py-1">
									{reward}
								</div>
							))}
						</div>
					))}
				</div>
			)}

			<button
				type="button"
				className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
				onClick={onRemove}
			>
				Remove this Mystery
			</button>
		</form>
	);
}
