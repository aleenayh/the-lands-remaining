import { AnimatePresence } from "framer-motion";
import { Switch, Tooltip } from "radix-ui";
import { useId } from "react";
import { usePreferences } from "../../context/PreferencesContext";
import { ReactComponent as Logo } from "../assets/tlr-logo.svg";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { Divider } from "../shared/Divider";
import { StyledTooltip } from "../shared/Tooltip";
import { ReactComponent as CogIcon } from "./cog.svg";
import { GameInfo } from "./GameInfo";

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
						className="drawerButton hidden md:block"
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
							<PreferencesControls />
							<Divider />
							<GameInfo />
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

	const themeId = useId();

	return (
		<div>
			<h2 className="text-lg font-bold text-theme-text-accent">Change Theme</h2>
			<div className="flex flex-col md:grid md:grid-cols-2 gap-2 justify-center items-center md:justify-start text-left">
				<label htmlFor={`${themeId}-elegy`} className="cursor-pointer">
					<input
						id={`${themeId}-elegy`}
						type="radio"
						value="elegy"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "elegy"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					Elegy
				</label>
				<label htmlFor={`${themeId}-forest`} className="cursor-pointer">
					<input
						id={`${themeId}-forest`}
						type="radio"
						value="forest"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "forest"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					The Great Forest
				</label>
				<label htmlFor={`${themeId}-sagravelle`} className="cursor-pointer">
					<input
						id={`${themeId}-sagravelle`}
						type="radio"
						value="sagravelle"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "sagravelle"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					Sagravelle
				</label>
				<label htmlFor={`${themeId}-nevask`} className="cursor-pointer">
					<input
						id={`${themeId}-nevask`}
						type="radio"
						value="nevask"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "nevask"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					Nevask
				</label>
				<label htmlFor={`${themeId}-dark`} className="cursor-pointer">
					<input
						id={`${themeId}-dark`}
						type="radio"
						value="dark"
						name="theme"
						className="mr-2"
						defaultChecked={initialTheme === "dark"}
						onChange={(e) => confirmTheme(e.target.value)}
					/>
					High Contrast (Dark)
				</label>
				<label htmlFor={`${themeId}-light`} className="cursor-pointer">
					<input
						id={`${themeId}-light`}
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

function PreferencesControls() {
	const {
		prefersImmediateDice,
		saveImmediateDicePreference,
		prefersReducedMotion,
		saveMotionPreference,
	} = usePreferences();

	return (
		<div>
			<h2 className="text-lg font-bold text-theme-text-accent">Preferences</h2>
			<div className="flex gap-2 justify-start items-center">
				<Switch.Root
					checked={!prefersImmediateDice}
					onCheckedChange={(checked) => saveImmediateDicePreference(!checked)}
					className="flex gap-2 items-center data-[state=checked]:bg-theme-bg-primary border border-theme-border-accent  h-4 w-9 rounded-full bg-theme-bg-secondary p-px transition shadow-inner shadow-black/20"
				>
					<Switch.Thumb className="data-[state=checked]:translate-x-4 block h-3 w-4 rounded-full bg-theme-accent-primary shadow-sm transition" />
				</Switch.Root>
				<div>
					Roll dice instantly:{" "}
					<Tooltip.Root>
						<Tooltip.Trigger asChild>
							<span className="font-bold text-theme-text-accent">
								{" "}
								{prefersImmediateDice ? "ON" : "OFF"}
							</span>
						</Tooltip.Trigger>
						<Tooltip.Content className="z-30" side="right">
							<StyledTooltip>
								{" "}
								{prefersImmediateDice
									? "Dice results are reported immediately when you click to roll."
									: "App simulates the time it takes to roll physical dice before showing results."}
							</StyledTooltip>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>
			<div className="flex gap-2 justify-start items-center">
				<Switch.Root
					checked={!prefersReducedMotion}
					onCheckedChange={(checked) => saveMotionPreference(!checked)}
					className="flex gap-2 items-center data-[state=checked]:bg-theme-bg-primary border border-theme-border-accent  h-4 w-9 rounded-full bg-theme-bg-secondary p-px transition shadow-inner shadow-black/20"
				>
					<Switch.Thumb className="data-[state=checked]:translate-x-4 block h-3 w-4 rounded-full bg-theme-accent-primary shadow-sm transition" />
				</Switch.Root>
				<div>
					Reduce motion:{" "}
					<Tooltip.Root>
						<Tooltip.Trigger asChild>
							<span className="font-bold text-theme-text-accent">
								{" "}
								{prefersReducedMotion ? "ON" : "OFF"}
							</span>
						</Tooltip.Trigger>
						<Tooltip.Content className="z-30" side="right">
							<StyledTooltip>
								{" "}
								{prefersReducedMotion
									? "Disables animations and transitions that use motion. This includes the spin on dice rolls."
									: "Enables all animations and transitions."}
							</StyledTooltip>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>
		</div>
	);
}

function Credits() {
	return (
		<div className="flex flex-col gap-2 justify-start items-start text-left w-full text-sm pb-12 md:pb-4">
			<h3 className="text-lg font-bold text-theme-text-accent text-center w-full">
				About this Site
			</h3>
			<p>
				Site designed and maintained by{" "}
				<a href="https://github.com/aleenayh" translate="no">
					Aleena Yunuba.
				</a>{" "}
				If you encounter accessibility issues, please{" "}
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
				<span translate="no">The Lands Remaining </span> is a creation of{" "}
				<span translate="no">Jason Cordova </span> distributed by{" "}
				<a href="https://www.gauntlet-rpg.com/">
					<span translate="no">The Gauntlet</span>
				</a>
				. This game is currently in development and playtesting. Please{" "}
				<a href="https://discord.com/invite/ScVrPDgfeg">
					join the Gauntlet on Discord
				</a>{" "}
				for the latest game updates.
			</p>
		</div>
	);
}
