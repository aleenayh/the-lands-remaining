import { AnimatePresence } from "framer-motion";
import { Tooltip } from "radix-ui";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { StyledTooltip } from "../shared/Tooltip";
import { AddMystery } from "./AddMystery";
import { Countdown } from "./Countdown";
import { ReactComponent as HourglassIcon } from "./hourglass.svg";

export function MysterySheet({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const {
		gameState,
		user: { role },
	} = useGame();
	const mysteries = gameState.mysteries;

	return (
		<div className="flex flex-col justify-start items-start h-full w-full pointer-events-none">
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						aria-label="Open mysteries"
						className="drawerButton"
						onClick={() => setIsOpen(!isOpen)}
					>
						<HourglassIcon className="w-full h-full" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="z-30 pl-1" side="right">
						<StyledTooltip>Mysteries</StyledTooltip>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
			<AnimatePresence>
				{isOpen && (
					<BorderedTray>
						<CloseTrayButton close={() => setIsOpen(!isOpen)} />
						<h1 className="text-2xl font-bold text-theme-text-accent mb-10">
							Mysteries
						</h1>
						<div className="flex flex-col gap-10 overflow-y-auto">
							{mysteries && mysteries.length > 0 ? (
								mysteries.map((mystery) => (
									<Countdown mystery={mystery} key={mystery.title} />
								))
							) : (
								<div>No active mysteries</div>
							)}
						</div>
						{role === PlayerRole.KEEPER && <AddMystery />}
					</BorderedTray>
				)}
			</AnimatePresence>
		</div>
	);
}
