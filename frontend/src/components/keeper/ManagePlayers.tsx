import { Dialog } from "radix-ui";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { type Player, PlayerRole } from "../../context/types";
import { playbookBases } from "../playbooks/content";
import { type playbookKey, playbookKeys } from "../playbooks/types";

export function ManagePlayers() {
	const {
		gameState: { players },
		updateGameState,
		user: { role, id },
	} = useGame();

	const [retireModalOpen, setRetireModalOpen] = useState(false);
	const [removePlayerModalOpen, setRemovePlayerModalOpen] = useState(false);
	const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

	const triggerModalFor = (
		playerId: string,
		modalType: "retire" | "remove",
	) => {
		setSelectedPlayerId(playerId);
		if (modalType === "retire") {
			setRetireModalOpen(true);
		} else {
			setRemovePlayerModalOpen(true);
		}
	};

	const removeCharacter = () => {
		const playerId = selectedPlayerId;
		if (!playerId) return;
		updateGameState({
			players: players.map((player) => {
				if (player.id === playerId) {
					return { ...player, character: null };
				}
				return player;
			}),
		});
		toast.success(
			`${players.find((player) => player.id === playerId)?.name}'s Ember has been retired.`,
		);
		setRetireModalOpen(false);
		setSelectedPlayerId(null);
	};

	const removePlayer = () => {
		const playerId = selectedPlayerId;
		if (!playerId) return;
		updateGameState({
			players: players.filter((player) => player.id !== playerId),
		});
		toast.success(`Player has been removed from the game.`);
		setRemovePlayerModalOpen(false);
		setSelectedPlayerId(null);
	};

	if (role !== PlayerRole.KEEPER) return null;

	return (
		<div className="flex flex-col gap-2 text-theme-text-primary">
			<h4>Remove players or Embers</h4>
			<p className="italic text-xs text-left text-theme-text-muted">
				Retiring an Ember here is the same as the player doing it themselves.
				The player will be prompted to create a new Ember the next time they
				join the game. Removing a player will prompt them to rejoin the game if
				they return, and make a fresh Ember. This Keeper tool is intended for
				players who unexpectedly leave the campaign. Removing Embers is{" "}
				<strong>PERMANENT.</strong>
			</p>

			<div className="flex flex-col justify-center items-start gap-2 ">
				{players
					.filter((player) => player.id !== id)
					.map((player, i) => {
						return (
							<div
								key={player.id}
								className={`px-6 w-full flex text-sm gap-2 justify-evenly items-center ${i % 2 === 0 ? "bg-theme-bg-secondary" : ""}`}
							>
								<div className="flex flex-1 gap-4 items-center">
									<p>{player.name}</p>{" "}
									<button
										type="button"
										className="text-theme-text-primary bg-theme-bg-primary hover:bg-theme-bg-accent border border-theme-border-accent rounded-lg p-1"
										onClick={() => triggerModalFor(player.id, "remove")}
									>
										Remove {player.name} from game
									</button>
								</div>
								<div className="flex flex-1 gap-4 items-center">
									<p>
										{player.character
											? `playing ${prettyPlaybookName(player.character.playbook)}`
											: "with no active Ember"}
									</p>{" "}
									{player.character ? (
										<button
											type="button"
											className="text-theme-text-primary bg-theme-bg-primary hover:bg-theme-bg-accent border border-theme-border-accent rounded-lg p-1"
											onClick={() => triggerModalFor(player.id, "retire")}
										>
											Retire Ember
										</button>
									) : null}
								</div>
							</div>
						);
					})}
			</div>
			<Dialog.Root open={retireModalOpen} onOpenChange={setRetireModalOpen}>
				<Dialog.Portal>
					<Dialog.Overlay className="DialogOverlay" style={{ zIndex: 20 }} />
					<Dialog.Content className="DialogContent" style={{ zIndex: 30 }}>
						<Dialog.Close asChild>
							<button
								type="button"
								className="absolute top-2 right-2 aspect-square w-8 h-8 bg-theme-bg-accent text-theme-text-primary rounded-full flex justify-center items-center"
							>
								X
							</button>
						</Dialog.Close>
						<Dialog.Title className="DialogTitle">Retire Ember</Dialog.Title>
						<Dialog.Description className="DialogDescription">
							Are you sure you wish to retire this Ember? This action is
							PERMANENT.
						</Dialog.Description>
						<div className="flex flex-col gap-2 w-full justify-center items-center">
							<div className="flex justify-center items-center gap-2">
								{" "}
								{prettyCharacterName(players, selectedPlayerId)}
							</div>
							<button
								type="button"
								className="text-theme-text-primary bg-theme-bg-primary hover:bg-theme-bg-accent border border-theme-border-accent rounded-lg p-1"
								onClick={removeCharacter}
							>
								Yes, retire this Ember
							</button>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
			<Dialog.Root
				open={removePlayerModalOpen}
				onOpenChange={setRemovePlayerModalOpen}
			>
				<Dialog.Portal>
					<Dialog.Overlay className="DialogOverlay" style={{ zIndex: 20 }} />
					<Dialog.Content className="DialogContent" style={{ zIndex: 30 }}>
						<Dialog.Close asChild>
							<button
								type="button"
								className="absolute top-2 right-2 aspect-square w-8 h-8 bg-theme-bg-accent text-theme-text-primary rounded-full flex justify-center items-center"
							>
								X
							</button>
						</Dialog.Close>
						<Dialog.Title className="DialogTitle">Remove Player</Dialog.Title>
						<Dialog.Description className="DialogDescription">
							Are you sure you wish to remove this player? This action is
							PERMANENT. If they have an associated Ember, it will be retired
							immediately.
						</Dialog.Description>
						<div className="flex flex-col gap-2 w-full justify-center items-center">
							<p className="text-small text-left text-theme-text-muted">
								This action does not prevent the player from rejoining the game
								if they return. They will be prompted to join the game and
								create a new Ember.
							</p>

							<div className="flex justify-center items-center gap-2">
								Removing:{" "}
								{players.find((player) => player.id === selectedPlayerId)?.name}
							</div>
							<button
								type="button"
								className="text-theme-text-primary bg-theme-bg-primary hover:bg-theme-bg-accent border border-theme-border-accent rounded-lg p-1"
								onClick={removePlayer}
							>
								Yes, remove this player
							</button>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
}

function prettyPlaybookName(playbook: playbookKey): string {
	if (playbook === playbookKeys.custom) return "a custom Ember";
	const content = playbookBases[playbook];
	if (!content)
		return `the ${playbook.charAt(0).toUpperCase()}${playbook.slice(1).replace(/-/g, " ")}`;
	return content.title;
}

function prettyCharacterName(
	players: Player[],
	playerId: string | null,
): string {
	if (!playerId) return "this Ember";
	const player = players.find((player) => player.id === playerId);
	if (!player) return "this Ember";

	const character = player.character;
	if (!character) return `${player.name}'s Ember`;

	return `${character.name} as ${prettyPlaybookName(character.playbook)}`;
}
