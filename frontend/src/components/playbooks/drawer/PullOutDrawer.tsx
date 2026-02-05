import { AnimatePresence } from "framer-motion";
import { Tooltip } from "radix-ui";
import { useGame } from "../../../context/GameContext";
import { PlayerRole } from "../../../context/types";
import { CopyInvite } from "../../settings/GameInfo";
import { CloseTrayButton } from "../../shared/CloseTrayButton";
import { BorderedTray } from "../../shared/DecorativeBorder";
import { Section } from "../../shared/Section";
import { StyledTooltip } from "../../shared/Tooltip";
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
		user: { id, role },
	} = useGame();
	const otherCharacters = gameState.players
		.filter((player) => player.id !== id)
		.map((player) => player.character)
		.filter((character): character is Character => character !== null);

	return (
		<div className="flex flex-col md:hidden justify-start items-start h-full w-full pointer-events-none">
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						aria-label="Open settings"
						className="drawerButton"
						onClick={() => setIsOpen(!isOpen)}
					>
						<GroupIcon className="w-full h-full" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="z-30 pl-1" side="right">
						<StyledTooltip>Embers</StyledTooltip>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
			<AnimatePresence>
				{isOpen && (
					<BorderedTray>
						<CloseTrayButton close={() => setIsOpen(!isOpen)} />
						<h1 className="text-2xl font-bold text-theme-text-accent">
							{role === PlayerRole.PLAYER && "Other "}Embers
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
