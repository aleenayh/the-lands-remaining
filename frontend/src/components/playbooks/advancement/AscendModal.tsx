import { Dialog } from "radix-ui";
import { useState } from "react";
import { useGame } from "../../../context/GameContext";
import { downloadCharacterJSON } from "../../../utils/download";
import { playbookBases } from "../content";

export function AscendTheThroneModal() {
	const [step, setStep] = useState<"ascendText" | "confirm">("ascendText");
	const [isOpen, setIsOpen] = useState(false);
	const {
		gameState,
		updateGameState,
		gameHash,
		user: { id },
	} = useGame();
	const character = gameState.players.find(
		(player) => player.id === id,
	)?.character;
	if (!character) {
		return null;
	}

	const closeModal = () => {
		setStep("ascendText");
		setIsOpen(false);
	};

	const retireCharacter = () => {
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === id ? { ...player, character: null } : player,
			),
		});
	};

	const downloadCharacter = () => {
		downloadCharacterJSON(
			character,
			`TLR-${gameHash}-character-${character.name.toLowerCase().replace(/ /g, "-")}.json`,
		);
	};

	const ascendTheThroneContent =
		playbookBases[character.playbook].ascendTheThrone;

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger asChild className="DialogTrigger">
				<button type="button">Ascend the Throne</button>
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
					<Dialog.Title className="DialogTitle">Ascend the Throne</Dialog.Title>
					<Dialog.Description className="hidden">
						Ascend the Throne of the Old Capitol.
					</Dialog.Description>
					{step === "ascendText" && (
						<div className="flex flex-col gap-4 overflow-y-auto max-h-[500px]">
							{ascendTheThroneContent.map((line, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: text
								<p key={index}>{parsedStrong(line)}</p>
							))}
							<div className="mx-auto w-1/3 gap-4 flex justify-center items-center">
								<button
									type="button"
									className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
									onClick={() => setStep("confirm")}
								>
									Ascend
								</button>
							</div>
						</div>
					)}
					{step === "confirm" && (
						<div className="flex flex-col gap-4 overflow-y-auto max-h-[500px]">
							<p>Are you sure you want to ascend the throne?</p>

							<p className="mb-4">
								Pressing ascend will remove the character from the tracked game
								state. You will lose customizations and advancements, and will
								be prompted to create a new character next time you join.
							</p>
							<p className="mb-4">
								This action is{" "}
								<strong className="text-theme-text-accent font-bold">
									PERMANENT
								</strong>
								.
							</p>
							<p className="inline text-left">
								Before continuing, you may{" "}
								<button
									type="button"
									onClick={downloadCharacter}
									className="text-theme-text-accent underline hover:text-theme-text-secondary transition-colors"
								>
									download your character file
								</button>{" "}
								to use when returning to Ambarell.
							</p>
							<div className="flex flex-row gap-4">
								<div className="mx-auto w-1/3 gap-4 flex justify-center items-center">
									<button
										type="button"
										onClick={closeModal}
										className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
									>
										Not yet
									</button>
								</div>
								<div className="mx-auto w-1/3 gap-4 flex justify-center items-center">
									<button
										type="button"
										className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
										onClick={retireCharacter}
									>
										Ascend
									</button>
								</div>
							</div>
						</div>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function parsedStrong(text: string): React.ReactNode {
	const parts = text.split(/(<strong>.*?<\/strong>)/g);
	return parts.map((part, i) => {
		const match = part.match(/<strong>(.*?)<\/strong>/);
		if (match) {
			return (
				// biome-ignore lint/suspicious/noArrayIndexKey: stable text content
				<strong key={i} className="text-theme-text-accent font-900">
					{match[1]}
				</strong>
			);
		}
		return part;
	});
}
