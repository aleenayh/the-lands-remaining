import { AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { findSupplicant } from "../mystery/content";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { Divider } from "../shared/Divider";
import { Section } from "../shared/Section";
import { Alcove } from "./Alcove";
import { anchoresses } from "./content";
import { ReactComponent as TowerIcon } from "./tower.svg";
import type { AnchoressContent } from "./types";

export function TowerSheet({
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
				<TowerIcon className="w-full h-full" />
			</button>
			<AnimatePresence>
				{isOpen && (
					<BorderedTray>
						<CloseTrayButton close={() => setIsOpen(!isOpen)} />
						<h1 className="text-2xl font-bold text-theme-text-accent mb-10">
							The Mourning Tower
						</h1>
						<div className="flex flex-col gap-2 justify-start items-center h-full overflow-y-auto">
							<Supplicants />
							<Divider />
							<Alcove />
							<Divider />
							<Anchoresses />
						</div>
					</BorderedTray>
				)}
			</AnimatePresence>
		</div>
	);
}

function Supplicants() {
	const { gameState } = useGame();
	const supplicantKeys = gameState.tower.supplicants;
	return (
		<div className="flex flex-col gap-2">
			<h2 className="text-lg font-bold text-theme-text-accent">Supplicants</h2>
			{supplicantKeys && supplicantKeys.length > 0 ? (
				supplicantKeys.map((key) => {
					const supplicant = findSupplicant(key);
					return (
						<div key={key} className="flex gap-2">
							<h3 className="text-sm font-bold text-theme-text-accent">
								{key}:{" "}
							</h3>
							<p className="text-sm text-theme-text-secondary text-left">
								{supplicant}
							</p>
						</div>
					);
				})
			) : (
				<div>No supplicants have yet been chosen.</div>
			)}
		</div>
	);
}

function Anchoresses() {
	const {
		gameState,
		user: { role },
	} = useGame();
	const showAnchoresses =
		Object.values(gameState.tower.anchoresses).some(
			(anchoress) => anchoress.state !== "available",
		) || role === PlayerRole.KEEPER;
	if (!showAnchoresses) return null;
	return (
		<div className="flex flex-col gap-2">
			<h2 className="text-lg font-bold text-theme-text-accent">
				The Anchoresses of the Cloister
			</h2>
			<p className="text-xs text-left italic">
				After unlocking the Cloister, in place of praying at a Shrine of
				Remembrance when they visit the Mourning Tower, the Embers can instead
				pray with one of the Anchoresses in the Cloister. If they choose to do
				so, the Keeper selects an Anchoress and assigns prompts as with a Shrine
				of Remembrance (note: there is no need to mark Cinder). The Embers
				collectively receive a Quest from the Anchoress once the narration is
				finished; the Embers cannot have more than three active Quests. The
				Embers gain access to that Anchoress’s Fire once the Quest is complete
				(it is possible for a Quest to already be complete when received, in
				which case the Embers automatically gain access to that Fire). An
				Anchoress’s Fire can be marked when stoking the Fire; the five boxes can
				be marked in any order, and are shared by the Embers.{" "}
			</p>
			<div className="flex flex-col gap-2">
				{Object.entries(anchoresses).map(([name, anchoress]) => (
					<Anchoress anchoress={anchoress} keyString={name} key={name} />
				))}
			</div>
		</div>
	);
}

function Anchoress({
	anchoress,
	keyString,
}: {
	anchoress: AnchoressContent;
	keyString: string;
}) {
	const {
		gameState,
		updateGameState,
		user: { role },
	} = useGame();
	const anchoressState = gameState.tower.anchoresses[keyString];

	const handleQuestChange = (index: number) => {
		const newQuest = [...anchoressState.quest];
		newQuest[index] = newQuest[index] === 1 ? 0 : 1;
		updateGameState({
			tower: {
				...gameState.tower,
				anchoresses: {
					...gameState.tower.anchoresses,
					[keyString]: { ...anchoressState, quest: newQuest },
				},
			},
		});
	};

	const handleFireChange = (index: number) => {
		const newFires = [...anchoressState.fires];
		newFires[index] = newFires[index] === 1 ? 0 : 1;
		updateGameState({
			tower: {
				...gameState.tower,
				anchoresses: {
					...gameState.tower.anchoresses,
					[keyString]: { ...anchoressState, fires: newFires },
				},
			},
		});
	};

	const changeAnchoressState = (state: "prayer" | "quest" | "fires") => {
		updateGameState({
			tower: {
				...gameState.tower,
				anchoresses: {
					...gameState.tower.anchoresses,
					[keyString]: { ...anchoressState, state },
				},
			},
		});
	};

	if (anchoressState.state === "available" && role !== PlayerRole.KEEPER)
		return null;

	return (
		<Section
			title={anchoress.name}
			minify
			leftAlign
			collapsible
			key={anchoress.name}
		>
			{anchoressState.state === "available" && (
				<div className="flex flex-col gap-2 justify-center items-center">
					<button
						type="button"
						className="w-1/3 bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
						onClick={() => changeAnchoressState("prayer")}
					>
						Pray with {anchoress.name}
					</button>
				</div>
			)}
			{anchoressState.state === "prayer" && (
				<div className="flex flex-col gap-2">
					<h4 className="text-sm font-bold text-theme-text-accent">
						Pray with {anchoress.name}
					</h4>
					<p className="text-sm text-left">{anchoress.prayer.intro}</p>
					<ol>
						{anchoress.prayer.prompts.map((prompt) => (
							<li key={prompt} className="text-sm text-left">
								{prompt}
							</li>
						))}
					</ol>
					<div className="flex flex-col gap-2 justify-center items-center">
						<button
							type="button"
							className="w-1/3 bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
							onClick={() => changeAnchoressState("quest")}
						>
							Conclude Prayer
						</button>
					</div>
				</div>
			)}
			{anchoressState.state === "quest" && (
				<div className="flex flex-col gap-2">
					<h4 className="text-sm font-bold text-theme-text-accent">
						Quest of {anchoress.name}
					</h4>
					<p className="text-sm text-left italic">
						{anchoress.quest.description}
					</p>
					<div className="flex justify-center items-center gap-2">
						{Array.from({ length: anchoress.quest.checkboxes }).map(
							(_, index) => (
								<input
									type="checkbox"
									key={`${anchoress.name}-quest-${index}`}
									checked={anchoressState.quest[index] === 1}
									onChange={() => handleQuestChange(index)}
								/>
							),
						)}
					</div>
					<div className="flex flex-col gap-2 justify-center items-center">
						<button
							type="button"
							className="w-1/3 bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
							onClick={() => changeAnchoressState("fires")}
						>
							Conclude Quest
						</button>
					</div>
				</div>
			)}
			{anchoressState.state === "fires" && (
				<div className="flex flex-col gap-2">
					<h4 className="text-sm font-bold text-theme-text-accent">
						Fires of {anchoress.name}
					</h4>
					<div className="flex flex-col gap-2 border-l border-theme-border-accent pl-4">
						{Array.from({ length: anchoress.fires.length }).map((_, index) => (
							<li
								key={`${anchoress.name}-fire-${index}`}
								className="flex gap-2 items-baseline justify-start"
							>
								<input
									type="checkbox"
									key={`${anchoress.name}-fire-${index}`}
									checked={anchoressState.fires[index] === 1}
									onChange={() => handleFireChange(index)}
								/>{" "}
								<p
									className={`text-sm text-left ${anchoressState.fires[index] === 1 ? "line-through" : ""}`}
								>
									{anchoress.fires[index]}
								</p>
							</li>
						))}
					</div>
				</div>
			)}
		</Section>
	);
}
