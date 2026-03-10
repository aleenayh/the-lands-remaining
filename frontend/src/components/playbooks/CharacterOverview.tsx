import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { MobileDrawerNavigation } from "../Drawers";
import { KeeperPill } from "../keeper/KeeperPill";
import { KeeperSummary } from "../keeper/KeeperSummary";
import { CopyInvite } from "../settings/GameInfo";
import { GlassyButton } from "../shared/GlassyButton";
import { playbookBases } from "./content";
import { CharacterCreateForm } from "./creation/CharacterCreateForm";
import { CustomCreateForm } from "./creation/CustomCreateForm";
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
			<div className="flex flex-1 min-h-0 overflow-hidden gap-1 max-w-[1400px] mx-auto mb-6 md:mb-2 ">
				{/* Other players' playbooks - takes up ~60% width, shows up to 4 in a grid */}
				{otherCharacters.length > 0 ? (
					<div
						className={`hidden  min-w-0 md:grid gap-2 auto-rows-fr overflow-hidden grid-cols-[repeat(auto-fit,minmax(200px,1fr))]      ${user.role === PlayerRole.KEEPER ? "w-full" : otherCharacters.length === 1 ? "w-[50%]" : "w-[60%]"}`}
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
					<div
						className={`w-full min-w-0 min-h-0 overflow-hidden ${otherCharacters.length > 1 ? "md:w-[40%]" : "md:w-[50%]"}`}
					>
						{myCharacter ? (
							<PlaybookExpanded character={myCharacter} />
						) : (
							<CharacterCreationStarter onCollapse={() => setRoleToKeeper()} />
						)}
					</div>
				)}
			</div>
			<MobileDrawerNavigation />
		</div>
	);
}

function CharacterCreationStarter({ onCollapse }: { onCollapse: () => void }) {
	const { gameState } = useGame();
	const [key, setKey] = useState<playbookKey | null>(null);
	const activeEmbers = gameState.players
		.filter((player) => player.character !== null)
		.map((player) => {
			return { name: player.name, playbook: player.character?.playbook };
		});

	const floatKeeperToTop = !gameState.players.some(
		(player) => player.role === PlayerRole.KEEPER,
	);

	return (
		<div className="border-2 border-theme-border-accent rounded-lg p-4 h-full flex flex-col overflow-hidden">
			{key ? (
				<>
					<button
						type="button"
						onClick={() => setKey(null)}
						className="self-start text-sm text-theme-text-muted hover:text-theme-text-primary mb-2 shrink-0"
					>
						← Back to Embers
					</button>
					<div className="flex-1 overflow-y-auto min-h-0">
						{key === playbookKeys.custom ? (
							<CustomCreateForm />
						) : (
							<CharacterCreateForm playbookKey={key} />
						)}
					</div>
				</>
			) : (
				<div className="flex flex-col gap-4 h-full">
					<h1 className="text-2xl font-bold text-center text-theme-text-accent shrink-0">
						Choose an Ember
					</h1>
					{floatKeeperToTop && (
						<GlassyButton key="keeper" onClick={() => onCollapse()}>
							Play as Keeper (No Character)
						</GlassyButton>
					)}
					<div className="flex flex-col md:grid md:grid-cols-2 gap-2 flex-1 overflow-y-auto md:flex-none">
						{Object.values(playbookKeys).map((playbookKey) => {
							const base = playbookBases[playbookKey];
							const activeEmber = activeEmbers.find(
								(ember) => ember.playbook === playbookKey,
							);
							return (
								<GlassyButton
									key={playbookKey}
									onClick={() => setKey(playbookKey)}
								>
									{base.title}{" "}
									<span className="text-sm text-theme-text-muted italic hover:text-theme-text-accent">
										{activeEmber ? `(Played by ${activeEmber.name})` : ""}
									</span>
								</GlassyButton>
							);
						})}
						{!floatKeeperToTop && (
							<GlassyButton key="keeper" onClick={() => onCollapse()}>
								Play as Keeper (No Character)
							</GlassyButton>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
