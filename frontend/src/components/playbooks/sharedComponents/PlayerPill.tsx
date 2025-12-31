import { Tooltip } from "radix-ui";
import { useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { ReactComponent as DiceIcon } from "../../assets/dice.svg";
import { StyledTooltip } from "../../shared/Tooltip";

export function PlayerPill({ playerId }: { playerId: string }) {
	const { gameState } = useGame();
	const player = gameState.players.find((player) => player.id === playerId);
	if (!player) return null;
	return (
		<div className="absolute top-2 right-2 rounded-xl w-auto px-1 py-[0.05rem] bg-theme-bg-secondary border-2 border-theme-border-accent">
			<p className="text-sm text-theme-text-primary">{player.name}</p>
		</div>
	);
}

export function DiceIndicator({ playerId }: { playerId: string }) {
	const {
		gameState,
		user: { id },
	} = useGame();
	const [isOpen, setIsOpen] = useState(false);
	const [rolling, setRolling] = useState(false);
	const lastRoll = gameState.players.find(
		(player) => player.id === playerId,
	)?.lastRoll;
	//don't force tooltip for self, you're already rolling in the modal
	const isSelf = playerId === id;

	useEffect(() => {
		if (!lastRoll || isSelf) return;
		//zero is an impossible roll, we use it to indicate in process of rolling
		if (lastRoll.roll === 0) {
			setRolling(true);
			setIsOpen(true);
		} else if (lastRoll.roll !== 0) {
			setRolling(false);
			setTimeout(() => {
				setIsOpen(false);
			}, 4000);
		}
	}, [lastRoll, isSelf]);

	return (
		<Tooltip.Root open={isOpen} onOpenChange={setIsOpen}>
			<div className="absolute top-1 left-1 text-theme-border-accent">
				<Tooltip.Trigger>
					<DiceIcon className="w-10 h-10" />
				</Tooltip.Trigger>
			</div>
			<Tooltip.Content>
				<StyledTooltip>
					{!rolling ? (
						<div className="flex flex-col gap-1">
							<div className="text-xs text-theme-text-muted">Last roll:</div>{" "}
							<div className="text-lg font-bold">
								<strong>{lastRoll?.roll}</strong>
							</div>
							<div className="lowercase text-xs text-theme-text-muted">
								({lastRoll?.type ?? "N/A"})
							</div>
						</div>
					) : (
						<div className="diceRolling">
							{" "}
							<DiceIcon className="w-10 h-10" />
						</div>
					)}
				</StyledTooltip>
			</Tooltip.Content>
		</Tooltip.Root>
	);
}
