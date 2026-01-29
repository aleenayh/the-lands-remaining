import { useGame } from "../../../context/GameContext";

export function PlayerPill({ playerId }: { playerId: string }) {
	const { gameState } = useGame();
	const player = gameState.players.find((player) => player.id === playerId);
	if (!player) return null;
	return (
		<div className="rounded-xl w-auto px-1 py-[0.05rem] bg-theme-bg-secondary border-2 border-theme-border-accent">
			<p className="text-sm text-theme-text-primary">{player.name}</p>
		</div>
	);
}
