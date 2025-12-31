import { toast } from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { downloadGameStateJSON } from "../../utils/download";
import { ReactComponent as CopyIcon } from "./copy.svg";

export function GameInfo() {
	const { gameHash, user, gameState } = useGame();

	const copyToClipboard = () => {
		navigator.clipboard.writeText(gameHash);
		toast.success("Copied to clipboard!");
	};
	const backToLanding = () => {
		localStorage.removeItem("playerRole");
		window.location.href = "/";
	};

	const clickDownload = () => {
		downloadGameStateJSON(gameState, `TLR-game-${gameHash}.json`);
	};

	return (
		<div className="flex flex-col gap-2 pointer-events-auto">
			<div className="flex justify-center items-center gap-2">
				<p>Currently Playing</p>

				<button
					type="button"
					className="bg-theme-bg-accent border-2 border-theme-border-accent hover:bg-theme-bg-accent transition-colors flex justify-center items-center rounded-lg p-2 gap-2"
					onClick={copyToClipboard}
				>
					<CopyIcon className="w-4 h-4" /> {gameHash}
				</button>

				<p>as {user.name}.</p>
			</div>

			<button
				type="button"
				onClick={backToLanding}
				className="text-theme-text-accent underline hover:text-theme-text-secondary transition-colors"
			>
				Join a different game
			</button>
			<p className="text-theme-text-secondary text-sm inline text-left">
				Games are considered active if they have been used during the last 3
				months. Inactive games are periodically removed. If you want to take a
				longer break,{" "}
				<button
					type="button"
					onClick={clickDownload}
					className="text-theme-text-accent underline hover:text-theme-text-secondary transition-colors"
				>
					download your game file
				</button>{" "}
				to use when re-starting your game.
			</p>
		</div>
	);
}

export function CopyInvite() {
	const { gameHash } = useGame();

	const copyToClipboard = () => {
		navigator.clipboard.writeText(gameHash);
		toast.success("Copied to clipboard!");
	};

	const copyUrlToClipboard = () => {
		navigator.clipboard.writeText(window.location.href);
		toast.success("Copied to clipboard!");
	};

	return (
		<div className="flex flex-col gap-2 text-theme-text-primary">
			<p>When other players join, their Embers will appear here.</p>

			<p>Invite others to join your game:</p>
			<button
				type="button"
				className="bg-theme-bg-accent border-2 border-theme-border-accent hover:bg-theme-bg-accent transition-colors flex justify-center items-center rounded-lg p-2 gap-2"
				onClick={copyToClipboard}
			>
				<CopyIcon className="w-4 h-4" /> {gameHash}
			</button>
			<button
				type="button"
				className="bg-theme-bg-accent border-2 border-theme-border-accent hover:bg-theme-bg-accent transition-colors flex justify-center items-center rounded-lg p-2 gap-2"
				onClick={copyUrlToClipboard}
			>
				<CopyIcon className="w-4 h-4" /> Join Link
			</button>
		</div>
	);
}
