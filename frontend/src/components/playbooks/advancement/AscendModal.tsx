import { Dialog } from "radix-ui";
import { useGame } from "../../../context/GameContext";
import { playbookBases } from "../content";

export function AscendTheThroneModal() {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const character = gameState.players.find(
		(player) => player.id === id,
	)?.character;
	if (!character) {
		return null;
	}
	const retireCharacter = () => {
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === id ? { ...player, character: null } : player,
			),
		});
	};
	const ascendTheThroneContent =
		playbookBases[character.playbook].ascendTheThrone;

	return (
		<Dialog.Root>
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
					<div className="flex flex-col gap-4 overflow-y-auto max-h-[500px]">
						{ascendTheThroneContent.map((line, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: text
							<p key={index}>{parsedStrong(line)}</p>
						))}
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
