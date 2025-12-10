import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";

export function KeeperPill() {
	const { user, gameState, updateGameState } = useGame();
	const resetRole = () => {
		updateGameState({
			players: gameState.players.map((player) => {
				if (player.id === user.id) {
					return { ...player, role: PlayerRole.PLAYER };
				}
				return player;
			}),
		});
	};

	return (
		<div className="absolute top-4 right-4 flex flex-col gap-2">
			<div className="rounded-lg p-2 bg-theme-bg-secondary border-2 border-theme-border-accent">
				You are the Keeper.
			</div>
			<p className="inline text-sm text-theme-text-muted">
				To join as a character,{" "}
				<button
					type="button"
					className="text-theme-text-accent hover:text-theme-accent-primary transition-colors"
					onClick={resetRole}
				>
					reset your role.
				</button>
			</p>
		</div>
	);
}
