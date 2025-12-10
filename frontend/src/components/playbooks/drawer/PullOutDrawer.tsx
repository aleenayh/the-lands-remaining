import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../../../context/GameContext";
import { PlaybookPane } from "../PlaybookPane";
import { Section } from "../sharedComponents/Section";
import type { Character } from "../types";
import { ReactComponent as GroupIcon } from "./group.svg";

export function PullOutCharacterOverview({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const {
		gameState,
		user: { id },
	} = useGame();
	const otherCharacters = gameState.players
		.filter((player) => player.id !== id)
		.map((player) => player.character)
		.filter((character): character is Character => character !== null);

	return (
		<div className="flex flex-col justify-start items-start h-full w-full pointer-events-none">
			<button
				type="button"
				aria-label="Open character overview"
				className="block md:hidden w-10 h-10 text-theme-accent-primary bg-theme-bg-secondary rounded-none rounded-br-lg p-2 hover:bg-theme-bg-accent hover:text-theme-text-accent transition-colors pointer-events-auto rounded-tr-lg"
				onClick={() => setIsOpen(!isOpen)}
			>
				<GroupIcon className="w-full h-full" />
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ left: "-100%" }}
						animate={{ left: 0 }}
						exit={{ left: "-100%" }}
						transition={{ duration: 1 }}
						className="absolute top-0 left-0 w-full md:w-1/2 h-screen flex flex-col justify-start items-center bg-theme-bg-secondary border-r border-theme-border-accent rounded-lg p-4 z-10 transition-all ease-linear overflow-y-auto pointer-events-auto"
					>
						<button
							type="button"
							className="absolute top-0 right-0 w-8 h-8"
							onClick={() => setIsOpen(!isOpen)}
						>
							X
						</button>
						<h1 className="text-2xl font-bold text-theme-text-accent">
							Other Embers
						</h1>
						<div className="w-full min-w-0 flex flex-col gap-2 overflow-y-auto">
							{otherCharacters.map((character) => (
								<Section
									key={character.playerId}
									title={character.name}
									collapsible={true}
								>
									<PlaybookPane character={character} />
								</Section>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
