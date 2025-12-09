import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { resetGameToDefaults } from "../lib/firebase";
import { Drawers } from "./Drawers";
import { CharacterOverview } from "./playbooks/CharacterOverview";

// Toggle this to show/hide debug controls
const DEBUG_MODE = false;

export function Game() {
	const { gameState, gameHash } = useGame();
	const land = gameState.land;

	// Set theme based on current land
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", land);
	}, [land]);

	return (
		<div className="flex flex-col w-full h-full p-4 overflow-hidden">
			{DEBUG_MODE && <DebugControls gameHash={gameHash} />}
			<Drawers />
			<div className="flex-1 min-h-0 overflow-hidden">
				<CharacterOverview />
			</div>
		</div>
	);
}

function DebugControls({ gameHash }: { gameHash: string }) {
	const [isResetting, setIsResetting] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleReset = async () => {
		setIsResetting(true);
		try {
			await resetGameToDefaults(gameHash);
			// Reload to get fresh state
			window.location.reload();
		} catch (error) {
			console.error("Failed to reset game:", error);
		} finally {
			setIsResetting(false);
			setShowConfirm(false);
		}
	};

	return (
		<div className="shrink-0 flex items-center gap-2 mb-2 p-2 bg-red-900/20 border border-red-700/50 rounded text-xs">
			<span className="text-red-400 font-mono">DEBUG</span>
			<span className="text-theme-text-muted">Hash: {gameHash}</span>
			{showConfirm ? (
				<div className="ml-auto flex items-center gap-2">
					<span className="text-red-300">Reset all players & progress?</span>
					<button
						type="button"
						onClick={handleReset}
						disabled={isResetting}
						className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white rounded disabled:opacity-50"
					>
						{isResetting ? "..." : "Yes"}
					</button>
					<button
						type="button"
						onClick={() => setShowConfirm(false)}
						className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
					>
						No
					</button>
				</div>
			) : (
				<button
					type="button"
					onClick={() => setShowConfirm(true)}
					className="ml-auto px-2 py-1 bg-red-800 hover:bg-red-700 text-red-100 rounded"
				>
					Reset Game
				</button>
			)}
		</div>
	);
}
