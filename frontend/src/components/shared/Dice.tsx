import { AnimatePresence, motion } from "framer-motion";
import { Dialog, Tooltip } from "radix-ui";
import { useEffect, useId, useState } from "react";
import { useGame } from "../../context/GameContext";
import { ReactComponent as DiceIcon } from "../assets/dice.svg";
import type { Mystery, Question } from "../mystery/types";
import { StyledTooltip } from "./Tooltip";

export function DiceIndicator({ playerId }: { playerId: string }) {
	const {
		gameState,
		user: { id },
	} = useGame();
	const [isOpen, setIsOpen] = useState(false);
	const [rolling, setRolling] = useState(false);
	const lastRoll = gameState.players.find(
		(player) => player.id === playerId,
	)?.lastRoll;
	//don't force tooltip for self, you're already rolling in the modal
	const isSelf = playerId === id;

	useEffect(() => {
		if (!lastRoll || isSelf) return;
		//zero is an impossible roll, we use it to indicate in process of rolling
		if (lastRoll.roll === 0) {
			setRolling(true);
			setIsOpen(true);
		} else if (lastRoll.roll !== 0) {
			setRolling(false);
			setTimeout(() => {
				setIsOpen(false);
			}, 4000);
		}
	}, [lastRoll, isSelf]);

	const openForThreeSeconds = () => {
		setIsOpen(true);
		setTimeout(() => {
			setIsOpen(false);
		}, 3000);
	};

	return (
		<Tooltip.Root open={isOpen} onOpenChange={setIsOpen}>
			<div className="text-theme-border-accent">
				<Tooltip.Trigger asChild>
					<button type="button" onClick={openForThreeSeconds}>
						<DiceIcon className="w-10 h-10" />
					</button>
				</Tooltip.Trigger>
			</div>
			<Tooltip.Content>
				<StyledTooltip>
					{!rolling ? (
						<div className="flex flex-col gap-1">
							<div className="text-xs text-theme-text-muted">Last roll:</div>{" "}
							<div className="text-lg font-bold">
								<strong>{lastRoll?.roll}</strong>
							</div>
							<div className="lowercase text-xs text-theme-text-muted">
								({lastRoll?.type ?? "N/A"})
							</div>
						</div>
					) : (
						<div className="diceRolling">
							{" "}
							<DiceIcon className="w-10 h-10" />
						</div>
					)}
				</StyledTooltip>
			</Tooltip.Content>
		</Tooltip.Root>
	);
}

export type Die = {
	id: string;
	value: number;
	isRolling: boolean;
	exclude: boolean;
};

export function AnswerQuestionDiceRollModal({
	mystery,
	question,
}: {
	mystery: Mystery;
	question: Question;
}) {
	const id = useId();
	const resetDice = (number: number) => {
		return Array.from({ length: number }, (_, index) => ({
			id: `${id}-${index}`,
			value: 0,
			isRolling: false,
			exclude: false,
		}));
	};
	const [dice, setDice] = useState<Die[]>(resetDice(2));
	const [total, setTotal] = useState<number | null>(null);
	const [bounceValue, setBounceValue] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const { gameState, updateGameState } = useGame();

	const mysteryState = gameState.mysteries.find(
		(m) => m.title === mystery.title,
	);
	const questionState = mysteryState?.questions?.find(
		(q) => q.text === question.text,
	);
	const cluesAssigned =
		mysteryState?.clues?.filter((clue) => clue.explained && !clue.removed)
			.length ?? 0;

	const complexity = questionState?.complexity ?? 2;
	const [modifier, setModifier] = useState(cluesAssigned - complexity);
	useEffect(() => {
		setModifier(cluesAssigned - complexity);
	}, [cluesAssigned, complexity]);
	if (!questionState || !mysteryState) {
		return null;
	}

	const calcTotal = (diceToCalc: Die[]) => {
		setTimeout(() => {
			const result = diceToCalc
				.filter((die) => !die.exclude)
				.reduce((acc, die) => acc + die.value, 0);
			const thisTotal = result + modifier;
			setTotal(thisTotal);
			updateGameState({
				mysteries: gameState.mysteries.map((m) =>
					m.title === mystery.title
						? {
								...m,
								questions: m.questions?.map((q) =>
									q.text === question.text ? { ...q, result: thisTotal } : q,
								),
							}
						: m,
				),
			});
		}, 1500);
	};

	const handleRoll = () => {
		//update timestamp immediately allows other players to see that you're "rolling"
		//zero is an impossible roll, we use it to indicate in process of rolling

		setTotal(null);
		setBounceValue(false);
		const initialDice = resetDice(2);
		setDice(initialDice.map((die) => ({ ...die, isRolling: true })));

		setTimeout(() => {
			// Generate rolled values first so we can use them for both state and calculation
			const rolledDice = initialDice.map((die) => ({
				...die,
				isRolling: false,
				value: rollDie(),
			}));

			setDice(rolledDice);
			setBounceValue(true);
			calcTotal(rolledDice);
		}, 2500);
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setBounceValue(false);
			setTotal(null);
			setDice(resetDice(2));
		}
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger asChild>
				<div className="-m-1 text-theme-text-muted hover:text-theme-text-accent flex items-center justify-center">
					<DiceIcon className="w-8 h-8 transform rotate-45" />
				</div>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay" />
				<Dialog.Content className="DialogContent">
					<Dialog.Close asChild>
						<button
							type="button"
							onClick={() => handleOpenChange(false)}
							className="absolute top-2 right-2 aspect-square w-8 h-8 bg-theme-bg-accent text-theme-text-primary rounded-full flex justify-center items-center"
						>
							X
						</button>
					</Dialog.Close>
					<Dialog.Title className="DialogTitle">Answer Question</Dialog.Title>
					<Dialog.Description>{question.text}</Dialog.Description>

					<div className="pt-4 flex flex-col gap-2">
						<p className="text-theme-text-muted italic">
							A Complexity {complexity} question with {cluesAssigned} clues
							used. You can manually adjust the modifier before rolling if
							necessary.
						</p>
						<div className="my-4 flex gap-1 items-center justify-center">
							<button
								type="button"
								className="text-theme-text-accent border border-theme-border bg-theme-bg-primary hover:bg-theme-bg-accent flex items-center justify-center aspect-square rounded-full px-2"
								onClick={() => setModifier(modifier - 1)}
							>
								-
							</button>
							<span className="text-theme-text-accent border border-theme-border bg-theme-bg-primary text-center text-lg font-bold rounded-md p-2">
								{modifier}
							</span>
							<button
								type="button"
								className="text-theme-text-accent border border-theme-border bg-theme-bg-primary hover:bg-theme-bg-accent flex items-center justify-center aspect-square rounded-full px-2"
								onClick={() => setModifier(modifier + 1)}
							>
								+
							</button>
						</div>
					</div>

					<div className="w-full flex justify-center items-center">
						{" "}
						<button
							type="button"
							onClick={handleRoll}
							className="mx-auto bg-theme-bg-accent text-theme-text-primary rounded-md p-2 hover:bg-theme-bg-accent/80 hover:text-theme-text-primary/80"
						>
							Roll
						</button>
					</div>
					<div className="w-full h-32 flex gap-4 justify-center items-center">
						{Array.from({ length: 3 }).map((_, index) => (
							<DieComponent
								key={`${id}-${
									// biome-ignore lint/suspicious/noArrayIndexKey: visual only
									index
								}`}
								dice={dice}
								id={id}
								index={index}
							/>
						))}
					</div>
					<div className="flex flex-col justify-center items-center text-center text-lg font-bold">
						<span
							className={`${bounceValue ? "bounce" : ""} text-theme-text-accent`}
						>
							{modifier >= 0 ? `+${modifier}` : modifier}
						</span>
						Total: {total !== null ? total : ""}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export function DieComponent({
	dice,
	id,
	index,
}: {
	dice: Die[];
	id: string;
	index: number;
}) {
	const die = dice.find((die) => die.id === `${id}-${index}`);
	if (!die) {
		return null;
	}
	return (
		<div
			key={die.id}
			className={`diceBase ${die.exclude ? "diceExcluded" : ""} ${die.isRolling ? "diceRolling" : ""}`}
		>
			<AnimatePresence>
				{die.isRolling ? (
					<div className="diceRollingIcon" />
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						className="text-xl font-bold"
					>
						{die.value}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export function rollDie() {
	return Math.floor(Math.random() * 6) + 1;
}
