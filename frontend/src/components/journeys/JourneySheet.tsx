import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useGame } from "../../context/GameContext";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { Divider } from "../shared/Divider";
import { EditableLine } from "../shared/EditableLine";
import { Section } from "../shared/Section";
import { ReactComponent as CampfireIcon } from "./campfire.svg";
import { ReactComponent as FootprintsIcon } from "./footprints.svg";
import type { Journey } from "./types";

export function JourneySheet({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const { gameState, updateGameState } = useGame();
	const journeys = gameState.journeys;
	const { register, handleSubmit, reset } = useForm<{ journeyName: string }>();

	const addJourney = (data: { journeyName: string }) => {
		updateGameState({
			journeys: [
				...journeys,
				{ name: data.journeyName, checks: [0, 0, 0, 0], extra: "" },
			],
		});
		reset();
	};

	return (
		<div className="flex flex-col justify-start items-start h-full w-full pointer-events-none">
			<button
				type="button"
				aria-label="Open mystery sheet"
				className="w-10 h-10 text-theme-accent-primary bg-theme-bg-secondary rounded-none rounded-br-lg rounded-tr-lg p-2 hover:bg-theme-bg-accent hover:text-theme-text-accent transition-colors pointer-events-auto"
				onClick={() => setIsOpen(!isOpen)}
			>
				<FootprintsIcon className="w-full h-full" />
			</button>
			<AnimatePresence>
				{isOpen && (
					<div>
						<BorderedTray>
							<CloseTrayButton close={() => setIsOpen(!isOpen)} />
							<h1 className="text-2xl font-bold text-theme-text-accent mb-10">
								Journeys
							</h1>
							<div className="flex flex-col gap-10 h-full w-full items-stretch justify-start">
								{journeys.map((journey) => (
									<Section
										key={journey.name}
										title={journey.name}
										leftAlign
										minify
										collapsible
									>
										<JourneyForm journey={journey} />
									</Section>
								))}
								<form
									onSubmit={handleSubmit(addJourney)}
									className="flex gap-2 w-full justify-self-end"
								>
									<input
										type="text"
										placeholder="Add new journey..."
										className="flex-grow"
										{...register("journeyName")}
									/>
									<button
										type="submit"
										className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
									>
										Add
									</button>
								</form>
							</div>
						</BorderedTray>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}

function JourneyForm({ journey }: { journey: Journey }) {
	const { gameState, updateGameState } = useGame();

	const toggleCheck = (index: number) => {
		const newChecks = [...journey.checks];
		newChecks[index] = newChecks[index] === 1 ? 0 : 1;
		updateGameState({
			journeys: gameState.journeys.map((j) =>
				j.name === journey.name ? { ...j, checks: newChecks } : j,
			),
		});
	};

	const handleNotesChange = (value: string) => {
		updateGameState({
			journeys: gameState.journeys.map((j) =>
				j.name === journey.name ? { ...j, extra: value } : j,
			),
		});
	};

	const removeJourney = () => {
		updateGameState({
			journeys: gameState.journeys.filter((j) => j.name !== journey.name),
		});
	};

	return (
		<div className="flex flex-col gap-2 w-full items-stretch justify-start">
			<div className="flex gap-2 justify-center items-center">
				{Array.from({ length: 4 }).map((_, index) => (
					<button
						type="button"
						key={`${journey.name}-check-${index}`}
						className={`w-8 h-8 ${journey.checks[index] === 1 ? "text-theme-text-accent" : "text-theme-text-muted"}`}
						onClick={() => {
							toggleCheck(index);
						}}
					>
						<CampfireIcon className="w-8 h-8" />
					</button>
				))}
			</div>

			<Divider />
			<h4 className="text-sm font-bold text-theme-text-accent">Notes</h4>
			<div className="w-full flex flex-col gap-2 items-stretch justify-start">
				<EditableLine
					text={journey.extra}
					editable={true}
					onSave={(_, value) => handleNotesChange(value)}
					index={0}
				/>
				<button
					type="button"
					className="w-1/3 mx-auto bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
					onClick={removeJourney}
				>
					Remove {journey.name}
				</button>
			</div>
		</div>
	);
}
