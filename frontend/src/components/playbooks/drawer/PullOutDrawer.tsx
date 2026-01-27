import { AnimatePresence } from "framer-motion";
import { useGame } from "../../../context/GameContext";
import { CopyInvite } from "../../settings/GameInfo";
import { CloseTrayButton } from "../../shared/CloseTrayButton";
import { BorderedTray } from "../../shared/DecorativeBorder";
import { Section } from "../../shared/Section";
import { PlaybookPane } from "../PlaybookPane";
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
					<BorderedTray>
						<CloseTrayButton close={() => setIsOpen(!isOpen)} />
						<h1 className="text-2xl font-bold text-theme-text-accent">
							Other Embers
						</h1>
						{otherCharacters.length > 0 ? (
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
						) : (
							<CopyInvite />
						)}
					</BorderedTray>
				)}
			</AnimatePresence>
		</div>
	);
}
