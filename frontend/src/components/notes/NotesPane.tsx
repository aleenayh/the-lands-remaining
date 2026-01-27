import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { ReactComponent as NotesIcon } from "./quill.svg";

export function NotesPane({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const { gameHash } = useGame();
	const localNotes =
		localStorage.getItem(`TLR_notes_${gameHash}`) ||
		localStorage.getItem(`TLR_notes`);
	const [notes, setNotes] = useState(localNotes || "");
	const [buttonText, setButtonText] = useState("Save");

	const saveLocal = () => {
		setButtonText("Saving...");
		localStorage.setItem(`TLR_notes_${gameHash}`, notes);
		setTimeout(() => {
			toast.success("Notes saved!");
			setButtonText("Saved!");
		}, 1000);
		setTimeout(() => {
			setButtonText("Save");
		}, 3000);
	};

	return (
		<div className="flex flex-col justify-start items-start h-full w-full pointer-events-none">
			<button
				type="button"
				aria-label="Open settings"
				className="w-10 h-10 text-theme-accent-primary bg-theme-bg-secondary rounded-none rounded-br-lg rounded-tr-lg p-2 hover:bg-theme-bg-accent hover:text-theme-text-accent transition-colors pointer-events-auto"
				onClick={() => setIsOpen(!isOpen)}
			>
				<NotesIcon className="w-full h-full" />
			</button>
			<AnimatePresence>
				{isOpen && (
					<BorderedTray>
						<CloseTrayButton close={() => setIsOpen(!isOpen)} />
						<h1 className="text-2xl font-bold text-theme-text-accent mb-6">
							Notes
						</h1>
						<div className="flex flex-col gap-4 justify-between h-full">
							<p className="text-balance">
								These personal notes are not shared with other players.
							</p>
							<textarea
								className=" bg-theme-bg-primary text-theme-text-primary border-2 border-theme-border-accent rounded-lg p-2 w-full h-full"
								defaultValue={notes}
								onBlur={(e) => setNotes(e.target.value)}
							/>
							<button
								type="button"
								onClick={saveLocal}
								className="bg-theme-bg-accent text-theme-text-accent border-2 border-theme-border-accent rounded-lg p-2 w-full hover:bg-theme-bg-accent/80 hover:text-theme-text-accent/80 transition-colors"
							>
								{buttonText}
							</button>
							<p className="text-sm md:text-md w-full md:w-1/2 mx-auto italic">
								Notes are saved locally. They will not persist if you change
								devices and can be lost if you clear cache.
							</p>
						</div>
					</BorderedTray>
				)}
			</AnimatePresence>
		</div>
	);
}
