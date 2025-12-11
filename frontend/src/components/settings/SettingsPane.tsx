import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { resetGameToDefaults } from "../../lib/firebase";
import { Section } from "../playbooks/sharedComponents/Section";
import { ReactComponent as CogIcon } from "./cog.svg";
import { GameInfo } from "./GameInfo";

// Toggle this to show/hide debug controls
const DEBUG_MODE = false;

export function SettingsPane({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	return (
		<div className="flex flex-col justify-start items-start h-full w-full pointer-events-none">
			<button
				type="button"
				aria-label="Open settings"
				className="w-10 h-10 text-theme-accent-primary bg-theme-bg-secondary rounded-none rounded-br-lg rounded-tr-lg p-2 hover:bg-theme-bg-accent hover:text-theme-text-accent transition-colors pointer-events-auto"
				onClick={() => setIsOpen(!isOpen)}
			>
				<CogIcon className="w-full h-full" />
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ left: "-100%" }}
						animate={{ left: 0 }}
						exit={{ left: "-100%" }}
						transition={{ duration: 1 }}
						className="absolute top-0 left-0 w-full md:w-1/2 h-screen flex flex-col justify-start items-center bg-theme-bg-secondary border-r border-theme-border-accent rounded-lg p-4 z-10 transition-all ease-linear overflow-y-auto pointer-events-auto"
					>
						<button
							type="button"
							className="absolute top-0 right-0 w-8 h-8"
							onClick={() => setIsOpen(!isOpen)}
						>
							X
						</button>
						<h1 className="text-2xl font-bold text-theme-text-accent mb-10">
							Settings
						</h1>
						<div className="flex flex-col gap-10 justify-between h-full">
							<ThemeSelector />
							<GameInfo />
							{DEBUG_MODE && <DebugControls />}
							<Credits />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function ThemeSelector() {
	const initialTheme = localStorage.getItem("theme") || "forest";

	const confirmTheme = (value: string) => {
		localStorage.setItem("theme", value);
		document.documentElement.setAttribute("data-theme", value);
	};

	return (
		<div>
			<h2 className="text-lg font-bold text-theme-text-accent">Change Theme</h2>
			<div className="flex flex-col gap-2">
				<label htmlFor="forest">
					<input
						type="radio"
						value="forest"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "forest"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					The Great Forest
				</label>
				<label htmlFor="dark">
					<input
						type="radio"
						value="dark"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "dark"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					High Contrast (Dark)
				</label>
				<label htmlFor="light">
					<input
						type="radio"
						value="light"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "light"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					High Contrast (Light)
				</label>
			</div>
		</div>
	);
}

function Credits() {
	return (
		<div className="flex flex-col gap-2 justify-start items-start text-left w-full text-lg">
			<h3 className="text-lg font-bold text-theme-text-accent text-center w-full">
				About this Site
			</h3>
			<p>
				Site designed and maintained by{" "}
				<a href="https://github.com/aleenayh">Aleena Yunuba.</a> If you
				encounter accessibility issues, please{" "}
				<a href="mailto:aleenayunuba@gmail.com">let me know</a>.
			</p>

			<p>
				The Lands Remaining is a creation of Jason Cordova distributed by{" "}
				<a href="https://www.gauntlet-rpg.com/">The Gauntlet</a>. This game is
				currently in development and playtesting. Please{" "}
				<a href="https://discord.com/invite/ScVrPDgfeg">
					join the Gauntlet on Discord
				</a>{" "}
				for the latest game updates.
			</p>
		</div>
	);
}

function DebugControls() {
	const { gameHash, gameState } = useGame();
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
		<div className="flex justify-center flex-col items-center">
			<div className="w-1/2 shrink-0 flex items-center gap-2 mb-2 p-2 bg-red-900/20 border border-red-700/50 rounded text-xs">
				<span className="text-red-400 font-mono">DEBUG</span>
				<span className="text-red-400">Hash: {gameHash}</span>
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
			<Section title="Game State" collapsible={true}>
				{gameState.players.map((player) => (
					<div key={player.id}>
						<h4 className="text-lg font-bold text-theme-text-accent">
							{player.name}
						</h4>
						<p className="text-sm text-theme-text-muted">{player.role}</p>
					</div>
				))}
			</Section>
		</div>
	);
}
