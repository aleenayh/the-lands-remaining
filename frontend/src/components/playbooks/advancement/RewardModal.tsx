import { Dialog } from "radix-ui";
import { useGame } from "../../../context/GameContext";

export function RewardModal() {
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

	const confirmReward = () => {
		console.log("confirmReward");
	};

	return (
		<Dialog.Root>
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
						<div className="mx-auto w-1/3 gap-4 flex justify-center items-center">
							<button
								type="button"
								className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
								onClick={confirmReward}
							>
								Confirm
							</button>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
