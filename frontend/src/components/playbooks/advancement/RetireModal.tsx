import { Dialog } from "radix-ui";
import { useGame } from "../../../context/GameContext";
import { downloadCharacterJSON } from "../../../utils/download";

export function RetireCharacterModal() {
	const {
		gameState,
		updateGameState,
		gameHash,
		user: { id },
	} = useGame();
	const character = gameState.players.find(
		(player) => player.id === id,
	)?.character;
	if (!character || Object.values(character.fireToCome).includes(true)) {
		return (
			<Dialog.Root>
				<Dialog.Trigger asChild className="DialogTrigger">
					<button type="button">Retire Character</button>
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
							Retire Character
						</Dialog.Title>
						<div>
							<p className="mb-4">
								You may not retire a character with a Fire to Come marked. You
								may instead Ascend the Throne.
							</p>
							<Dialog.Close
								asChild
								className="mx-auto w-1/3 flex justify-center items-center"
							>
								<button
									type="button"
									className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
								>
									Close
								</button>
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		);
	}

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

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild className="DialogTrigger">
				<button type="button">Retire Character</button>
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
					<Dialog.Title className="DialogTitle">Retire Character</Dialog.Title>
					<div className="flex flex-col gap-4 overflow-y-auto max-h-[500px]">
						<Dialog.Description className="mb-4">
							Retire this character to a life of obscurity. Narrate what becomes
							of them to the other Embers.
						</Dialog.Description>
						<p className="mb-4">
							Pressing retire will remove the character from the tracked game
							state. You will lose customizations and advancements, and will be
							prompted to create a new character next time you join.
						</p>
						<p className="mb-4">
							This action is{" "}
							<strong className="text-theme-text-accent font-bold">
								PERMANENT
							</strong>
							.
						</p>

						<p className="inline text-left">
							Before retiring, you may{" "}
							<button
								type="button"
								onClick={downloadCharacter}
								className="text-theme-text-accent underline hover:text-theme-text-secondary transition-colors"
							>
								download your character file
							</button>{" "}
							to use when returning to Ambarell.
						</p>
					</div>
					<div className="mx-auto w-2/3 gap-4 flex justify-center items-center">
						<Dialog.Close asChild>
							<button
								type="button"
								className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
							>
								Cancel
							</button>
						</Dialog.Close>
						<button
							type="button"
							className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
							onClick={retireCharacter}
						>
							Retire
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
