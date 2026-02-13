import { Dialog } from "radix-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGame } from "../../../context/GameContext";

export function RewardModal() {
	const {
		gameState,
		user: { id },
	} = useGame();
	const character = gameState.players.find(
		(player) => player.id === id,
	)?.character;
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<"select-reward" | "add-relic">(
		"select-reward",
	);
	if (!character) {
		return null;
	}

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger asChild className="DialogTrigger">
				<button type="button">Rewards</button>
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
					<Dialog.Title className="DialogTitle">Claim a Reward</Dialog.Title>
					<div className="flex flex-col gap-4 overflow-y-auto max-h-[500px]">
						<Dialog.Description>
							Claim a reward on completion of a mystery.
						</Dialog.Description>
						{step !== "select-reward" && <BackButton setStep={setStep} />}
						{step === "select-reward" && (
							<div className="mx-auto w-1/3 gap-4 flex justify-center items-center">
								<button
									type="button"
									className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
									onClick={() => setStep("add-relic")}
								>
									Add a Relic
								</button>
							</div>
						)}

						{step === "add-relic" && (
							<AddRelicForm onClose={() => setIsOpen(false)} />
						)}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function BackButton({
	setStep,
}: {
	setStep: (step: "select-reward" | "add-relic") => void;
}) {
	return (
		<div className="mx-auto w-full gap-4 flex justify-start items-center">
			<button
				type="button"
				className="text-theme-text-primary rounded-md hover:text-theme-text-accent"
				onClick={() => setStep("select-reward")}
			>
				← Back to Rewards
			</button>
		</div>
	);
}

type AddRelicFormInputs = {
	title: string;
	description: string;
	extraLines: number;
	type: "relic" | "equipment";
};

export function AddRelicForm({ onClose }: { onClose: () => void }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const { register, handleSubmit, reset } = useForm<AddRelicFormInputs>({
		defaultValues: {
			title: "",
			description: "",
			extraLines: 0,
			type: "equipment",
		},
	});

	const parseAspects = (lines: string[]): string[] => {
		return lines.map((line) =>
			line.replace(/<([^>]+)>/g, "<aspect>$1</aspect>"),
		);
	};

	const countAspects = (lines: string[]): number => {
		return lines.reduce((count, line) => {
			return count + (line.match(/<aspect>/g)?.length || 0);
		}, 0);
	};

	const onSubmit = (data: AddRelicFormInputs) => {
		const newAspects = countAspects(data.description.split("\n"));
		const newRelic = {
			title: data.title,
			text: parseAspects(data.description.split("\n")).join("\n"),
			extraLines: data.extraLines,
			type: data.type,
			aspects: Array.from({ length: newAspects }, () => 0),
			atAlcove: false,
		};

		updateGameState({
			players: gameState.players.map((player) =>
				player.character && player.id === id
					? {
							...player,
							character: {
								...player.character,
								relics: [...player.character.relics, newRelic],
							},
						}
					: player,
			),
		});
		reset();
		onClose();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-2">
				<label htmlFor="title">Title</label>
				<input
					type="text"
					{...register("title")}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				/>

				<p>
					Write or paste the description of the item below. To include aspects,
					surround your text with &lt; &gt; symbols. For example:{" "}
					<span className="italic">
						a burnished sword that &lt;glows with the light of the morning&gt;
					</span>
				</p>
				<textarea
					{...register("description")}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				/>

				<p>
					If the item includes customizable aspects you may add later, include a
					number of blank lines for them below.
				</p>
				<input
					type="number"
					{...register("extraLines")}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				/>

				<p>
					Relics are special items that cannot be targeted by Keeper reactions.
					Is this item a relic or equipment?
				</p>
				<div className="flex gap-2 justify-evenly">
					<div className="flex items-center justify-start">
						<input id="add-relic-type-relic" type="radio" {...register("type")} value="relic" />
						<label className="cursor-pointer" htmlFor="add-relic-type-relic">Relic</label>
					</div>
					<div className="flex items-center justify-start">
						<input id="add-relic-type-equipment" type="radio" {...register("type")} value="equipment" />
						<label className="cursor-pointer" htmlFor="add-relic-type-equipment">Equipment</label>
					</div>
				</div>

				<button
					type="submit"
					onClick={handleSubmit(onSubmit)}
					className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
				>
					Confirm
				</button>
			</div>
		</form>
	);
}
