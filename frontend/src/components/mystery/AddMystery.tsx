import { Dialog } from "radix-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { CountdownItem } from "./Countdown";
import { canonicalMysteries } from "./content";
import { type Mystery, MysteryTheme, type Question } from "./types";

type AddMysteryFormInputs = {
	title: string;
	questions: Question[];
	theme: MysteryTheme;
	countdownTotal: number;
};

type Tabs = keyof typeof canonicalMysteries | "choose" | "custom";

export function AddMystery() {
	const [selectedTab, setSelectedTab] = useState<Tabs>("choose");
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
				>
					Add Mystery
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay" style={{ zIndex: 20 }} />
				<Dialog.Content className="DialogContent" style={{ zIndex: 30 }}>
					<Dialog.Close asChild>
						<button
							type="button"
							className="absolute top-2 right-2 aspect-square w-8 h-8 bg-theme-bg-accent text-theme-text-primary rounded-full flex justify-center items-center"
						>
							X
						</button>
					</Dialog.Close>
					<Dialog.Title className="DialogTitle">Add Mystery</Dialog.Title>
					<Dialog.Description className="hidden">
						Add a new mystery to the game.
					</Dialog.Description>

					{selectedTab !== "choose" && (
						<button
							type="button"
							onClick={() => setSelectedTab("choose")}
							className="self-start text-sm text-theme-text-muted hover:text-theme-text-primary mb-2 shrink-0"
						>
							← Back to all mysteries
						</button>
					)}

					{selectedTab === "choose" && (
						<div className="flex flex-col gap-2 justify-center items-center">
							<h2 className="text-lg font-bold text-theme-text-accent">
								Choose an Option
							</h2>
							<button
								type="button"
								onClick={() => setSelectedTab("elegy")}
								className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
							>
								Elegy
							</button>
							<button
								type="button"
								onClick={() => setSelectedTab("greatForest")}
								className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
							>
								The Great Forest
							</button>
							<button
								type="button"
								onClick={() => setSelectedTab("custom")}
								className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
							>
								Custom Mystery
							</button>
						</div>
					)}

					{selectedTab === "custom" && (
						<CustomMysteryForm setIsOpen={setIsOpen} />
					)}

					{selectedTab !== "choose" && selectedTab !== "custom" && (
						<MysteryLookup type={selectedTab} setIsOpen={setIsOpen} />
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function CustomMysteryForm({
	setIsOpen,
}: {
	setIsOpen: (isOpen: boolean) => void;
}) {
	const [numberOfQuestions, setNumberOfQuestions] = useState(1);
	const { register, handleSubmit, watch, reset, setValue } =
		useForm<AddMysteryFormInputs>({
			defaultValues: {
				title: "",
				questions: [
					{
						text: "",
						complexity: 1,
						opportunity: "",
					},
				],
				theme: MysteryTheme.Dandelion,
				countdownTotal: 3,
			},
		});
	const { gameState, updateGameState } = useGame();

	const addQuestion = () => {
		setNumberOfQuestions(numberOfQuestions + 1);
		setValue(`questions.${numberOfQuestions}.text`, "");
		setValue(`questions.${numberOfQuestions}.complexity`, 1);
		setValue(`questions.${numberOfQuestions}.opportunity`, "");
	};
	const removeQuestion = () => {
		setValue(`questions`, watch("questions").slice(0, -1));
	};

	const onSubmit = (data: AddMysteryFormInputs) => {
		const newMystery: Mystery = {
			title: data.title,
			questions: data.questions,
			theme: data.theme,
			countdownTotal: data.countdownTotal,
			countdownCurrent: 0,
		};
		updateGameState({
			mysteries: [...gameState.mysteries, newMystery],
		});
		reset();
		setIsOpen(false);
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-2 overflow-y-auto max-h-[75vh]"
		>
			<div className="flex flex-col gap-2">
				<label
					htmlFor="title"
					className="text-theme-text-accent text-center font-bold"
				>
					Title
				</label>
				<input
					type="text"
					{...register("title")}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
				/>
				<Divider />
				<div className="flex flex-col gap-2">
					<label
						htmlFor="questions"
						className="text-theme-text-accent text-center font-bold"
					>
						Questions
					</label>
					{watch("questions").map((question: Question, index: number) => (
						<div
							className="flex flex-col md:flex-row items-center gap-2"
							// biome-ignore lint/suspicious/noArrayIndexKey: order unimportant
							key={`question-${index}`}
						>
							<div className="flex gap-2 items-center w-full md:w-auto">
								<label htmlFor={`questions.${index}.text`}>Text</label>
								<input
									type="text"
									defaultValue={question.text}
									{...register(`questions.${index}.text`)}
									className="flex-grow border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
								/>
							</div>
							<div className="flex gap-2 items-center w-full md:w-auto">
								<label htmlFor={`questions.${index}.complexity`}>
									Complexity
								</label>
								<input
									type="number"
									defaultValue={question.complexity}
									{...register(`questions.${index}.complexity`)}
									min={1}
									max={10}
									className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
								/>
							</div>
							<div className="flex gap-2 items-center w-full md:w-auto">
								<label htmlFor={`questions.${index}.opportunity`}>
									Opportunity
								</label>
								<input
									type="text"
									defaultValue={question.opportunity}
									{...register(`questions.${index}.opportunity`)}
									className="flex-grow border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
								/>
							</div>
						</div>
					))}

					<div className="flex gap-2 text-sm md:text-md">
						<button
							type="button"
							onClick={() => addQuestion()}
							className="w-1/2 mx-auto bg-theme-bg-accent text-theme-text-accent p-1 md:px-4 md:py-2 rounded-lg opacity-80 hover:opacity-100"
						>
							Add Question
						</button>

						<button
							type="button"
							onClick={() => removeQuestion()}
							className="w-1/2 mx-auto bg-theme-bg-accent text-theme-text-accent p-1 md:px-4 md:py-2 rounded-lg opacity-80 hover:opacity-100"
						>
							Remove Question
						</button>
					</div>
				</div>

				<Divider />
				<div className="mt-4 flex flex-col md:flex-row gap-2 items-center text-sm md:text-md">
					<div className="flex gap-2 items-center w-full md:w-auto">
						<label htmlFor="theme">Select Countdown Theme</label>
						<select
							{...register("theme")}
							className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
						>
							{Object.values(MysteryTheme).map((theme) => (
								<option key={theme} value={theme}>
									{theme}
								</option>
							))}
						</select>
					</div>
					<div className="flex gap-2 items-center w-full md:w-auto">
						<label htmlFor="countdownTotal">Countdown Total</label>
						<input
							type="number"
							{...register("countdownTotal")}
							min={1}
							max={20}
							className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
						/>
					</div>
				</div>

				<div className="hidden md:block">
					<Divider />
					<p className="text-center italic">Preview Countdown Timer</p>
					<Preview type={watch("theme")} total={watch("countdownTotal")} />
				</div>
				<Divider />
				<button
					type="submit"
					className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
				>
					Add Mystery
				</button>
			</div>
		</form>
	);
}

function MysteryLookup({
	type,
	setIsOpen,
}: {
	type: keyof typeof canonicalMysteries;
	setIsOpen: (isOpen: boolean) => void;
}) {
	const allMysteries = canonicalMysteries[type];

	const { register, handleSubmit, watch, reset } =
		useForm<AddMysteryFormInputs>({
			defaultValues: {
				title: "",
				theme: MysteryTheme.Dandelion,
			},
		});
	const { gameState, updateGameState } = useGame();

	const onSubmit = (data: { title: string; theme: MysteryTheme }) => {
		const mystery = allMysteries.find((m) => m.title === data.title);
		if (!mystery) {
			toast.error(`Something went wrong; mystery ${data.title} not found.`);
			return;
		}
		const newMystery: Mystery = {
			title: data.title,
			questions: mystery.questionsAndOpportunities.map((q) => ({
				text: q.question,
				complexity: q.complexity,
				opportunity: q.opportunity,
			})),
			theme: data.theme,
			countdownTotal: mystery.countdownTotal,
			countdownCurrent: 0,
			clues: mystery.clues.map((c) => ({
				text: c,
				earned: false,
				explained: false,
			})),
		};
		updateGameState({
			mysteries: [...gameState.mysteries, newMystery],
		});
		reset();
		setIsOpen(false);
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-2 overflow-y-auto max-h-[75vh]"
		>
			<div className="flex flex-col gap-2">
				<h2 className="text-lg font-bold text-theme-text-accent">
					Select a Mystery
				</h2>
				{allMysteries.map((mystery) => (
					<label
						key={mystery.title}
						htmlFor={mystery.title}
						className="text-theme-text-accent text-center font-bold"
					>
						<input
							type="radio"
							{...register("title")}
							value={mystery.title}
							className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
						/>
						{mystery.title}
					</label>
				))}

				<Divider />
				<div className="mt-4 flex flex-col md:flex-row gap-2 items-center text-sm md:text-md">
					<div className="flex gap-2 items-center w-full md:w-auto">
						<label htmlFor="theme">Select Countdown Theme</label>
						<select
							{...register("theme")}
							className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
						>
							{Object.values(MysteryTheme).map((theme) => (
								<option key={theme} value={theme}>
									{theme}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="hidden md:block">
					<Divider />
					<p className="text-center italic">Preview Countdown Timer</p>
					<Preview type={watch("theme")} total={3} />
				</div>
				<Divider />
				<button
					type="submit"
					className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
				>
					Add Mystery
				</button>
			</div>
		</form>
	);
}

function Divider() {
	return <div className="w-full bg-theme-bg-accent h-px" />;
}

function Preview({ type, total }: { type: MysteryTheme; total: number }) {
	return (
		<div className="flex gap-3 min-h-[100px] justify-center items-center mx-auto py-10">
			{" "}
			{Array.from({ length: total }).map((_, index) => (
				<CountdownItem
					key={`preview-${type}-${
						// biome-ignore lint/suspicious/noArrayIndexKey: preview only
						index
					}`}
					theme={type}
					index={index}
					filled={index === 0}
				/>
			))}
		</div>
	);
}
