import { useGame } from "../../context/GameContext";
import { Conditions } from "../playbooks/sharedComponents/Conditions";
import { PlayerPill } from "../playbooks/sharedComponents/PlayerPill";
import type { Character } from "../playbooks/types";
import { CopyInvite } from "../settings/GameInfo";

export function KeeperSummary() {
	const { gameState } = useGame();
	const characters = gameState.players
		.map((player) => player.character)
		.filter((character): character is Character => character !== null);

	return (
		<div className="block md:hidden overflow-y-auto">
			{characters.length > 0 ? (
				<div className="flex flex-col gap-2">
					{characters.map((character) => (
						<div
							key={character.playerId}
							className="border-2 border-theme-border-accent bg-theme-bg-primary rounded-lg p-4 relative"
						>
							<h2 className="text-lg whitespace-normal text-balance mx-auto">
								{character.name}
							</h2>
							<PlayerPill playerId={character.playerId} />
							<Conditions character={character} />
						</div>
					))}
				</div>
			) : (
				<div className="h-full flex md:hidden justify-center items-center py-10">
					<CopyInvite />
				</div>
			)}
		</div>
	);
}
