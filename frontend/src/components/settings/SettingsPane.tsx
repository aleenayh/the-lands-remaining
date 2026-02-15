import { AnimatePresence } from "framer-motion";
import { Tooltip } from "radix-ui";
import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { resetGameToDefaults } from "../../lib/firebase";
import { ReactComponent as Logo } from "../assets/tlr-logo.svg";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { Divider } from "../shared/Divider";
import { Section } from "../shared/Section";
import { StyledTooltip } from "../shared/Tooltip";
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
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						aria-label="Open game settings"
						className="drawerButton"
						onClick={() => setIsOpen(!isOpen)}
					>
						<CogIcon className="w-full h-full" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="z-30 pl-1" side="right">
						<StyledTooltip>Settings</StyledTooltip>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
			<AnimatePresence>
				{isOpen && (
					<BorderedTray>
						<CloseTrayButton close={() => setIsOpen(!isOpen)} />
						<div className="sticky flex flex-col justify-start items-center pointer-events-none">
							<Logo className="w-1/3 h-auto mx-auto mb-4" />
							<h1 className="text-2xl font-bold text-theme-text-accent">
								Settings
							</h1>
						</div>
						<div className="flex flex-col gap-10 justify-between h-full">
							<ThemeSelector />
							<Divider />
							<GameInfo />
							{DEBUG_MODE && <DebugControls />}
							<Divider />
							<Credits />
						</div>
					</BorderedTray>
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
			<div className="flex flex-col md:grid md:grid-cols-2 gap-2 justify-center items-center md:justify-start text-left">
				<label htmlFor="elegy" className="cursor-pointer">
					<input
						id="elegy"
						type="radio"
						value="elegy"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "elegy"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					Elegy
				</label>
				<label htmlFor="forest" className="cursor-pointer">
					<input
						id="forest"
						type="radio"
						value="forest"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "forest"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					The Great Forest
				</label>
				<label htmlFor="sagravelle" className="cursor-pointer">
					<input
						id="sagravelle"
						type="radio"
						value="sagravelle"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "sagravelle"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					Sagravelle
				</label>
				<label htmlFor="nevask" className="cursor-pointer">
					<input
						id="nevask"
						type="radio"
						value="nevask"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "nevask"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					Nevask
				</label>
				<label htmlFor="dark" className="cursor-pointer">
					<input
						id="dark"
						type="radio"
						value="dark"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "dark"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					High Contrast (Dark)
				</label>
				<label htmlFor="light" className="cursor-pointer">
					<input
						id="light"
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
		<div className="flex flex-col gap-2 justify-start items-start text-left w-full text-md">
			<h3 className="text-lg font-bold text-theme-text-accent text-center w-full">
				About this Site
			</h3>
			<p>
				Site designed and maintained by{" "}
				<a href="https://github.com/aleenayh">Aleena Yunuba.</a> If you
				encounter accessibility issues, please{" "}
				<button
					type="button"
					onClick={() => {
						window.location.href = "mailto:aleenayunuba@gmail.com";
					}}
					className="underline text-theme-text-primary hover:text-theme-accent-primary transition-colors"
				>
					let me know.
				</button>
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
