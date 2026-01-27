import { AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
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
			<button
				type="button"
				aria-label="Open mystery sheet"
				className="w-10 h-10 text-theme-accent-primary bg-theme-bg-secondary rounded-none rounded-br-lg rounded-tr-lg p-2 hover:bg-theme-bg-accent hover:text-theme-text-accent transition-colors pointer-events-auto"
				onClick={() => setIsOpen(!isOpen)}
			>
				<HourglassIcon className="w-full h-full" />
			</button>
			<AnimatePresence>
				{isOpen && (
					<BorderedTray>
						<CloseTrayButton close={() => setIsOpen(!isOpen)} />
						<h1 className="text-2xl font-bold text-theme-text-accent mb-10">
							Mysteries
						</h1>
						<div className="flex flex-col gap-10">
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
