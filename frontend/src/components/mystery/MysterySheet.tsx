import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "radix-ui";
import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { StyledTooltip } from "../shared/Tooltip";
import { AddMystery } from "./AddMystery";
import { ReactComponent as HourglassIcon } from "./hourglass.svg";
import { MysteryContent } from "./MysteryContent";

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
	const [displayedMystery, setDisplayedMystery] = useState<string | null>(
		mysteries[0]?.title || null,
	);

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
						<h1 className="text-2xl font-bold text-theme-text-accent mb-4">
							Mysteries
						</h1>
						<div className="w-full flex flex-col h-full overflow-hidden justify-between items-stretch">
							{/* buttons to switch views */}
							<div className="w-full flex flex-wrap gap-1 justify-center items-center mx-auto border-b-2 border-theme-border pb-2">
								{mysteries &&
									mysteries.length > 0 &&
									mysteries.map((mystery) => (
										<button
											type="button"
											key={mystery.title}
											className={`rounded-lg py-0 px-2 border transition-colors ${displayedMystery === mystery.title ? "bg-theme-bg-accent text-theme-text-accent border-theme-border-accent hover:bg-theme-bg-secondary" : "bg-theme-bg-primary text-theme-text-primary border-theme-border hover:bg-theme-bg-accent hover:text-theme-text-accent hover:border-theme-border-accent"}`}
											onClick={() => setDisplayedMystery(mystery.title)}
										>
											<span className="text-sm whitespace-nowrap">
												{mystery.title}
											</span>
										</button>
									))}
							</div>

							{/* mystery content */}
							<AnimatePresence>
								<div className="relative w-full h-full flex-1 overflow-y-auto">
									{mysteries && mysteries.length > 0 ? (
										mysteries.map(
											(mystery) =>
												displayedMystery === mystery.title && (
													<motion.div
														className="absolute transition-all w-full"
														key={mystery.title}
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														transition={{
															duration: 0.5,
															ease: "linear",
														}}
													>
														<MysteryContent mystery={mystery} />
													</motion.div>
												),
										)
									) : (
										<div>No active mysteries</div>
									)}
								</div>
							</AnimatePresence>

							{/* add mystery button - footer  */}
							{role === PlayerRole.KEEPER && <AddMystery />}
						</div>
					</BorderedTray>
				)}
			</AnimatePresence>
		</div>
	);
}
