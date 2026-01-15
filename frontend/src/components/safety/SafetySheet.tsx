import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { Divider } from "../shared/Divider";
import { ReactComponent as HeartShieldIcon } from "./heartshield.svg";

export function SafetyPane({
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
				<HeartShieldIcon className="w-full h-full" />
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
						<h1 className="text-2xl font-bold text-theme-text-accent mb-6">
							Safety Tools
						</h1>
						<div className="flex flex-col gap-4 justify-start items-center h-full">
							<p className="text-balance text-sm">
								No game is more important than the people playing it. Your game
								may use any safety tools you wish, but the Gauntlet typically
								recommends the Open Door Policy, the X-Card, and Lines and
								Veils. Each are explained below, and this app includes support
								to share Lines and Veils between players.
							</p>

							<LinesAndVeils />
							<Divider />
							<AddLineOrVeilForm />
							<Divider />
							<ExplainerSections />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function LinesAndVeils() {
	const { gameState, updateGameState } = useGame();
	const { lines, veils } = gameState.safety;

	const remove = (type: "line" | "veil", text: string) => {
		const newLines = lines.filter((line) => line !== text);
		const newVeils = veils.filter((veil) => veil !== text);
		updateGameState({
			safety: {
				lines: newLines,
				veils: newVeils,
			},
		});
		toast.success(`${type === "line" ? "Line" : "Veil"} removed: ${text}`);
	};

	return (
		<div className="w-full px-8  flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-6 md:justify-between text-left">
			<div className="flex flex-col gap-2">
				<h2 className="text-lg font-bold text-theme-text-accent">Lines</h2>
				<ul className="list-disc list-inside text-sm">
					{lines ? (
						lines.map((line) => <li key={line}>{line}</li>)
					) : (
						<li>No lines have been added yet.</li>
					)}
				</ul>
			</div>
			<div className="flex flex-col gap-2">
				<h2 className="text-lg font-bold text-theme-text-accent">Veils</h2>
				<ul className="list-disc list-inside text-sm">
					{veils ? (
						veils.map((veil) => <li key={veil}>{veil}</li>)
					) : (
						<li>No veils have been added yet.</li>
					)}
				</ul>
			</div>
			<Dialog.Root>
				<Dialog.Trigger asChild>
					<button
						type="button"
						className="md:col-span-2 mx-auto bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
					>
						Adjust or Remove Lines and Veils
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
							Adjust or Remove Lines and Veils
						</Dialog.Title>
						<Dialog.Description className="DialogDescription">
							Adjust or remove lines and veils.
						</Dialog.Description>
						<div className="flex flex-col gap-2 w-full">
							<ul className="list-disc list-inside text-sm gap-2">
								<h3 className="text-md font-bold text-theme-text-accent">
									Lines
								</h3>
								{lines ? (
									lines.map((line, index) => (
										<li key={line} className="flex items-center gap-2">
											<EditLineOrVeilForm
												type="line"
												index={index}
												text={line}
											/>{" "}
											<button
												type="button"
												className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
												onClick={() => remove("line", line)}
											>
												X
											</button>
										</li>
									))
								) : (
									<li>No lines have been added yet.</li>
								)}
								<h3 className="pt-2 text-md font-bold text-theme-text-accent">
									Veils
								</h3>
								{veils ? (
									veils.map((veil, index) => (
										<li key={veil} className="flex items-center gap-2">
											<EditLineOrVeilForm
												type="veil"
												index={index}
												text={veil}
											/>{" "}
											<button
												type="button"
												className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
												onClick={() => remove("veil", veil)}
											>
												X
											</button>
										</li>
									))
								) : (
									<li>No veils have been added yet.</li>
								)}
							</ul>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
}

function EditLineOrVeilForm({
	type,
	index,
	text,
}: {
	type: "line" | "veil";
	index: number;
	text: string;
}) {
	const { gameState, updateGameState } = useGame();
	const { register, handleSubmit, reset } = useForm<{ text: string }>({
		defaultValues: {
			text: text,
		},
	});
	const { lines, veils } = gameState.safety;

	const edit = (data: { text: string }) => {
		const newLines =
			type === "line"
				? lines?.map((line, i) => (i === index ? data.text : line))
				: lines;
		const newVeils =
			type === "veil"
				? veils?.map((veil, i) => (i === index ? data.text : veil))
				: veils;
		updateGameState({
			safety: {
				lines: newLines,
				veils: newVeils,
			},
		});
		toast.success(
			`${type === "line" ? "Line" : "Veil"} edited: ${text} → ${data.text}`,
		);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(edit)} className="w-full flex gap-2">
			<input
				type="text"
				defaultValue={text}
				{...register("text")}
				className="w-full"
			/>
			<button
				type="submit"
				className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
			>
				✓
			</button>
		</form>
	);
}

function AddLineOrVeilForm() {
	const { gameState, updateGameState } = useGame();
	const { lines, veils } = gameState.safety;
	const { register, handleSubmit, reset } = useForm<{
		text: string;
		type: "line" | "veil";
	}>({
		defaultValues: {
			text: "",
			type: "line",
		},
	});

	const addLineVeil = (formInput: { text: string; type: "line" | "veil" }) => {
		const newLines =
			formInput.type === "line" ? [...(lines || []), formInput.text] : lines;
		const newVeils =
			formInput.type === "veil" ? [...(veils || []), formInput.text] : veils;
		updateGameState({
			safety: {
				lines: newLines,
				veils: newVeils,
			},
		});
		toast.success(
			`${formInput.type === "line" ? "Line" : "Veil"} added: ${formInput.text}`,
		);
		reset();
	};
	return (
		<form onSubmit={handleSubmit(addLineVeil)}>
			<h3 className="text-lg font-bold text-theme-text-accent">
				Add a Line or Veil
			</h3>
			<p className="text-sm text-left mb-2">
				Text is submitted exactly as it is written below. All lines and veils
				are anonymous, and visible to the entire group.
			</p>
			<input
				type="text"
				placeholder="Enter line or veil..."
				className="w-full"
				{...register("text")}
			/>
			<div className="flex gap-2 justify-center">
				<div className="flex gap-2 items-center justify-start">
					<input type="radio" {...register("type")} value="line" />
					<label htmlFor="type">Line</label>
				</div>
				<div className="flex gap-2 items-center justify-start">
					<input type="radio" {...register("type")} value="veil" />
					<label htmlFor="type">Veil</label>
				</div>
			</div>
			<button
				type="submit"
				className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
			>
				Add
			</button>
		</form>
	);
}

function ExplainerSections() {
	const [view, setView] = useState<
		"none" | "open-door" | "x-card" | "lines-veils"
	>("none");
	return (
		<div className="w-full flex flex-col md:grid md:grid-cols-3 gap-2">
			<button
				type="button"
				className="w-full bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
				onClick={() => setView("open-door")}
			>
				Open Door Policy
			</button>
			<button
				type="button"
				className="w-full bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
				onClick={() => setView("x-card")}
			>
				X-Card
			</button>
			<button
				type="button"
				className="w-full bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-theme-bg-accent-hover hover:text-theme-text-accent-hover"
				onClick={() => setView("lines-veils")}
			>
				Lines and Veils
			</button>
			<div className="col-span-3 text-left">
				{view === "open-door" && (
					<div className="flex flex-col gap-2">
						<h3 className="text-lg font-bold text-theme-text-accent text-center">
							Open Door Policy
						</h3>
						<p>
							{" "}
							The Open Door Policy is very simple: you can leave the game for
							any reason and you don’t have to explain yourself. Just tell the
							group you have to go; no one here will ask any questions about it.
						</p>
					</div>
				)}

				{view === "x-card" && (
					<div className="flex flex-col gap-2">
						<h3 className="text-lg font-bold text-theme-text-accent text-center">
							X-Card
						</h3>
						<p>
							{" "}
							Because tabletop gaming is improvisational, we may encounter
							themes or topics not anticipated by other safety tools. The X-card
							is useful in case something in the game makes you feel
							uncomfortable in an un-fun way. Just tap or hold up the X-card and
							we will stop play in order to change whatever just happened in the
							game. The Keeper may ask for clarification on what is being
							X-carded, but will never ask why. Play resumes once the change is
							made.
						</p>

						<p className="italic text-sm text-theme-text-muted">
							The X-Card was developed by{" "}
							<a href="http://tinyurl.com/x-card-rpg">John Stavropoulos</a>.
						</p>
					</div>
				)}

				{view === "lines-veils" && (
					<div className="flex flex-col gap-2">
						<h3 className="text-lg font-bold text-theme-text-accent text-center">
							Lines and Veils
						</h3>
						<p>
							{" "}
							Lines and Veils are tools to pre-emptively establish boundaries
							around sensitive subject matter. Lines are things that we are not
							going to have in the game, period. Veils are things that we're ok
							with being in the game world but we prefer not to roleplay them,
							or we simply want to keep them offscreen. Lines and Veils can be
							added anonymously in this tab and will be seen by all players.
							Importantly, even the subjects listed as inherent to the game can
							still be lined or veiled.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
