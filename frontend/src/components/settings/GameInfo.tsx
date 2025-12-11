import { toast } from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { ReactComponent as CopyIcon } from "./copy.svg";

export function GameInfo() {
	const { gameHash, user } = useGame();

	const copyToClipboard = () => {
		navigator.clipboard.writeText(gameHash);
		toast.success("Copied to clipboard!");
	};
	const backToLanding = () => {
		localStorage.removeItem("playerRole");
		window.location.href = "/";
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
		</div>
	);
}
