import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { KeeperPill } from "../keeper/KeeperPill";
import { KeeperSummary } from "../keeper/KeeperSummary";
import { CopyInvite } from "../settings/GameInfo";
import { playbookBases } from "./content";
import { CharacterCreateForm } from "./creation/CharacterCreateForm";
import { PlaybookExpanded } from "./PlaybookExpanded";
import { PlaybookPane } from "./PlaybookPane";
import { type Character, type playbookKey, playbookKeys } from "./types";

export function CharacterOverview() {
	const {
		user,
		gameState: { players = [] },
		updateGameState,
	} = useGame();
	const myCharacter = players.find(
		(player) => player.id === user.id,
	)?.character;
	const otherCharacters = players
		.filter((player) => player.id !== user.id)
		.map((player) => player.character)
		.filter((character): character is Character => character !== null);

	const setRoleToKeeper = () => {
		updateGameState({
			players: players.map((player) => {
				if (player.id === user.id) {
					return { ...player, role: PlayerRole.KEEPER };
				}
				return player;
			}),
		});
	};

	return (
		<div className="flex flex-col h-full w-full overflow-hidden gap-3">
			<h1 className="text-2xl font-bold text-center text-theme-text-accent shrink-0 flex flex-col justify-evenly md:flex-row">
				<div className="w-0 h-0 md:w-1/3" />
				<span className="w-full md:w-2/3 text-md text-theme-text-primary flex justify-center">
					Character Keeper
				</span>
				{user.role === PlayerRole.KEEPER ? (
					<KeeperPill />
				) : (
					<div className="w-0 h-0 md:w-1/3" />
				)}
			</h1>
			{user.role === PlayerRole.KEEPER && <KeeperSummary />}
			<div className="flex flex-1 min-h-0 overflow-hidden gap-1">
				{/* Other players' playbooks - takes up ~60% width, shows up to 4 in a grid */}
				{otherCharacters.length > 0 ? (
					<div
						className={`hidden  min-w-0 md:grid  gap-2 auto-rows-fr overflow-hidden ${user.role === PlayerRole.KEEPER ? "w-full grid-cols-4" : "w-[60%] grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"}`}
					>
						{otherCharacters.map((character) => (
							<div key={character.playerId} className="min-h-0 overflow-hidden">
								<PlaybookPane character={character} />
							</div>
						))}
					</div>
				) : (
					<div
						className={`hidden h-full md:flex justify-center items-center text-center text-sm text-theme-text-muted p-10 ${user.role === PlayerRole.KEEPER ? "w-full" : "w-[60%]"}`}
					>
						<CopyInvite />
					</div>
				)}

				{/* Your playbook - slightly larger, takes ~40% width */}
				{user.role !== PlayerRole.KEEPER && (
					<div className="w-full md:w-[40%] min-w-0 min-h-0 overflow-hidden">
						{myCharacter ? (
							<PlaybookExpanded character={myCharacter} />
						) : (
							<CharacterCreationStarter onCollapse={() => setRoleToKeeper()} />
						)}
					</div>
				)}
			</div>
		</div>
	);
}

function CharacterCreationStarter({ onCollapse }: { onCollapse: () => void }) {
	const [key, setKey] = useState<playbookKey | null>(null);

	return (
		<div className="border-2 border-theme-border-accent rounded-lg p-4 h-full flex flex-col overflow-hidden">
			{key ? (
				<>
					<button
						type="button"
						onClick={() => setKey(null)}
						className="self-start text-sm text-theme-text-muted hover:text-theme-text-primary mb-2 shrink-0"
					>
						← Back to playbooks
					</button>
					<div className="flex-1 overflow-y-auto min-h-0">
						<CharacterCreateForm playbookKey={key} />
					</div>
				</>
			) : (
				<div className="flex flex-col gap-4 h-full">
					<h1 className="text-2xl font-bold text-center text-theme-text-accent shrink-0">
						Choose a Playbook
					</h1>
					<div className="flex flex-col gap-2 flex-1 overflow-y-auto">
						{Object.values(playbookKeys).map((playbookKey) => {
							const base = playbookBases[playbookKey];
							return (
								<button
									key={playbookKey}
									type="button"
									className="border border-theme-border px-4 py-3 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent transition-colors"
									onClick={() => setKey(playbookKey)}
								>
									{base.title}
								</button>
							);
						})}
						<button
							key="keeper"
							type="button"
							className="border border-theme-border px-4 py-3 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent transition-colors"
							onClick={() => onCollapse()}
						>
							Play as Keeper (No Character)
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
