import { Dialog } from "radix-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGame } from "../../context/GameContext";
import { CountdownItem } from "./Countdown";
import { type Mystery, MysteryTheme, type Question } from "./types";

type AddMysteryFormInputs = {
	title: string;
	questions: Question[];
	theme: MysteryTheme;
	countdownTotal: number;
};

export function AddMystery() {
	const [numberOfQuestions, setNumberOfQuestions] = useState(1);
	const [isOpen, setIsOpen] = useState(false);
	const { register, handleSubmit, watch, reset, setValue } =
		useForm<AddMysteryFormInputs>({
			defaultValues: {
				title: "",
				questions: [
					{
						text: "",
						complexity: 1,
					},
				],
				theme: MysteryTheme.Dandelion,
				countdownTotal: 3,
			},
		});
	const { gameState, updateGameState } = useGame();

	const addQuestion = () => {
		setNumberOfQuestions(numberOfQuestions + 1);
		setValue(`questions.${numberOfQuestions - 1}.text`, "");
		setValue(`questions.${numberOfQuestions - 1}.complexity`, 1);
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

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-2"
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
										className="flex items-center gap-2"
										// biome-ignore lint/suspicious/noArrayIndexKey: order unimportant
										key={`question-${index}`}
									>
										<label htmlFor={`questions.${index}.text`}>Text</label>
										<input
											type="text"
											defaultValue={question.text}
											{...register(`questions.${index}.text`)}
											className="flex-grow border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
										/>
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
								))}

								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => addQuestion()}
										className="w-1/2 mx-auto bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
									>
										Add Question
									</button>

									<button
										type="button"
										onClick={() => removeQuestion()}
										className="w-1/2 mx-auto bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
									>
										Remove Question
									</button>
								</div>
							</div>

							<Divider />
							<div className="mt-4 flex gap-2 items-center">
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
								<label htmlFor="countdownTotal">Countdown Total</label>
								<input
									type="number"
									{...register("countdownTotal")}
									min={1}
									max={20}
									className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
								/>
							</div>
							<Divider />
							<div>
								<p className="text-center italic">Preview Countdown Timer</p>
								<Preview
									type={watch("theme")}
									total={watch("countdownTotal")}
								/>
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
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
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
