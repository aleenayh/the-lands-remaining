import { AnimatePresence } from "framer-motion";
import { Dialog, Tooltip } from "radix-ui";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { Divider } from "../shared/Divider";
import { Section } from "../shared/Section";
import { StyledTooltip } from "../shared/Tooltip";
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
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						aria-label="Open Mourning Tower"
						className="drawerButton hidden md:block"
						onClick={() => setIsOpen(!isOpen)}
					>
						<TowerIcon className="w-full h-full" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="z-30 pl-1" side="right">
						<StyledTooltip>Mourning Tower</StyledTooltip>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
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
	const [supplicantFormOpen, setSupplicantFormOpen] = useState(false);
	const {
		gameState,
		user: { role },
		updateGameState,
	} = useGame();
	const supplicants = gameState.tower.supplicants;

	const removeSupplicant = (supplicant: string) => {
		const newSupplicants = { ...gameState.tower.supplicants };
		delete newSupplicants[supplicant];
		updateGameState({
			tower: { ...gameState.tower, supplicants: newSupplicants },
		});
	};
	return (
		<div className="flex flex-col gap-2">
			<h2 className="text-lg font-bold text-theme-text-accent">Supplicants</h2>
			{supplicants && Object.entries(supplicants).length > 0 ? (
				Object.entries(supplicants).map(([key, value]) => {
					return (
						<div key={key} className="inline-flex items-start gap-2">
							<h3 className="text-sm font-bold text-theme-text-accent">
								{key}:{" "}
							</h3>
							<p className="text-sm text-theme-text-secondary text-left">
								{value}
							</p>
							{role === PlayerRole.KEEPER && (
								<button
									type="button"
									className="bg-theme-bg-primary text-xs text-theme-text-primary p-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent hover:text-theme-text-accent"
									onClick={() => removeSupplicant(key)}
								>
									Remove
								</button>
							)}
						</div>
					);
				})
			) : (
				<div>No supplicants have yet been chosen.</div>
			)}
			{role === PlayerRole.KEEPER && (
				<Dialog.Root
					open={supplicantFormOpen}
					onOpenChange={setSupplicantFormOpen}
				>
					<Dialog.Trigger asChild>
						<button
							type="button"
							className="border border-theme-border bg-theme-bg-primary hover:bg-theme-bg-accent px-2 py-1 rounded-lg text-sm text-theme-text-secondary hover:text-theme-text-primary"
						>
							Add Supplicant
						</button>
					</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay className="DialogOverlay" />
						<Dialog.Content className="DialogContent">
							<Dialog.Close asChild>
								<button
									type="button"
									className="absolute top-2 right-2 aspect-square w-8 h-8 bg-theme-bg-accent text-theme-text-primary rounded-full flex justify-center items-center"
								>
									X
								</button>
							</Dialog.Close>
							<Dialog.Title className="DialogTitle">
								Add Supplicant
							</Dialog.Title>
							<Dialog.Description className="DialogDescription">
								Add a new supplicant to the Mourning Tower.
							</Dialog.Description>
							<AddSupplicantForm onClose={() => setSupplicantFormOpen(false)} />
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			)}
		</div>
	);
}

function AddSupplicantForm({ onClose }: { onClose: () => void }) {
	const { register, handleSubmit, reset } = useForm<{
		supplicant: string;
		description: string;
	}>({ defaultValues: { supplicant: "", description: "" } });
	const { gameState, updateGameState } = useGame();
	const id = useId();

	const onSubmit = (data: { supplicant: string; description: string }) => {
		const newSupplicants = {
			...gameState.tower.supplicants,
			[data.supplicant]: data.description,
		};
		updateGameState({
			tower: { ...gameState.tower, supplicants: newSupplicants },
		});
		reset();
		onClose();
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
			<label htmlFor={`supplicant-${id}`}>Supplicant Name</label>
			<input
				type="text"
				placeholder="Supplicant Name"
				id={`supplicant-${id}`}
				{...register("supplicant")}
				className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent"
			/>
			<label htmlFor={`description-${id}`}>
				Impact of consulting this Supplicant
			</label>
			<textarea
				className="min-h-40"
				placeholder="For example: 'Gain one extra Clue on the Information Move when consulting him about matters related to fungus, decay, or the unseen workings of the natural world, even on a miss.'"
				{...register("description")}
				id={`description-${id}`}
			/>
			<button
				type="submit"
				className="bg-theme-bg-primary text-theme-text-primary px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accenthover:text-theme-text-accent"
			>
				Add Supplicant
			</button>
		</form>
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
