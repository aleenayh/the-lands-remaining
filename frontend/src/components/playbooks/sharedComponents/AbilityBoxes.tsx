import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "radix-ui";
import { useId, useState } from "react";
import type { Abilities, Abilities as AbilityType } from "../types";

export function AbilityBoxes({
	stats,
	abbreviate = false,
}: {
	stats: AbilityType;
	abbreviate?: boolean;
}) {
	return (
		<div className={`flex justify-center gap-1 mx-0 md:mx-auto`}>
			{orderAbilities(stats).map(({ ability, value }) =>
				abbreviate ? (
					<StaticAbilityBox ability={ability} value={value} key={ability} />
				) : (
					<AbilityBox
						ability={ability}
						value={value}
						abbreviate={abbreviate}
						key={ability}
					/>
				),
			)}
		</div>
	);
}

function StaticAbilityBox({
	ability,
	value,
}: {
	ability: keyof AbilityType;
	value: number;
}) {
	return (
		<div className="flex flex-col gap-1 rounded-lg border border-theme-border-accent p-1 bg-theme-bg-secondary justify-center items-center min-w-[10%]">
			<h2 className="text-theme-text-muted text-[0.5rem] truncate max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
				{ability.slice(0, 4)}
			</h2>
			<div className="text-center text-lg font-bold bg-transparent">
				{value}
			</div>
		</div>
	);
}
export function orderAbilities(abilities: Abilities) {
	return order.map((stat) => ({
		ability: stat as keyof Abilities,
		value: abilities[stat as keyof Abilities],
	}));
}

const order = ["vitality", "composure", "reason", "presence", "cinder"];

type AbilityBoxProps = {
	ability: keyof AbilityType;
	value: number;
	abbreviate?: boolean;
};

type Die = {
	id: string;
	value: number;
	isRolling: boolean;
	exclude: boolean;
};

export function AbilityBox({
	ability,
	value,
	abbreviate = false,
}: AbilityBoxProps) {
	const [rollType, setRollType] = useState<
		"regular" | "advantage" | "disadvantage"
	>("regular");
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

	const calcTotal = (diceToCalc: Die[]) => {
		setTimeout(() => {
			const result = diceToCalc
				.filter((die) => !die.exclude)
				.reduce((acc, die) => acc + die.value, 0);
			const thisTotal = result + value;
			setTotal(thisTotal);
		}, 1500);
	};

	const handleRoll = () => {
		setTotal(null);
		setBounceValue(false);
		const numDice = rollType === "regular" ? 2 : 3;
		const initialDice = resetDice(numDice);
		setDice(initialDice.map((die) => ({ ...die, isRolling: true })));

		setTimeout(() => {
			// Generate rolled values first so we can use them for both state and calculation
			const rolledDice = initialDice.map((die) => ({
				...die,
				isRolling: false,
				value: rollDie(),
			}));

			setDice(rolledDice);

			if (rollType !== "regular") {
				setTimeout(() => {
					const idToExclude =
						rollType === "advantage"
							? rolledDice.find(
									(die) =>
										die.value ===
										Math.min(...rolledDice.map((die) => die.value)),
								)?.id
							: rolledDice.find(
									(die) =>
										die.value ===
										Math.max(...rolledDice.map((die) => die.value)),
								)?.id;

					const finalDice = rolledDice.map((die) => ({
						...die,
						exclude: die.id === idToExclude,
					}));

					setDice(finalDice);
					setBounceValue(true);
					calcTotal(finalDice);
				}, 1200);
			} else {
				setBounceValue(true);
				calcTotal(rolledDice);
			}
		}, 5000);
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
				<div className="flex flex-col gap-1 rounded-lg border border-theme-border-accent p-1 bg-theme-bg-secondary justify-center items-center min-w-[10%]">
					<h2 className="text-theme-text-muted text-[0.5rem] truncate max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
						{abbreviate ? ability.slice(0, 4) : ability}
					</h2>
					<div className="text-center text-lg font-bold bg-transparent">
						{value}
					</div>
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
					<Dialog.Title className="DialogTitle">
						Roll {ability.charAt(0).toUpperCase() + ability.slice(1)}
					</Dialog.Title>
					<Dialog.Description className="hidden">
						Roll with {ability}
					</Dialog.Description>
					<fieldset className="flex flex-col md:flex-row gap-2 justify-center items-center">
						<div className="flex items-center">
							<input
								type="radio"
								name="regular"
								id={`${id}-regular`}
								checked={rollType === "regular"}
								onChange={() => setRollType("regular")}
							/>
							<label htmlFor="regular">Regular Roll</label>
						</div>
						<div className="flex items-center">
							<input
								type="radio"
								name="advantage"
								id={`${id}-advantage`}
								checked={rollType === "advantage"}
								onChange={() => setRollType("advantage")}
							/>
							<label htmlFor="advantage">Advantage</label>
						</div>
						<div className="flex items-center">
							<input
								type="radio"
								name="disadvantage"
								id={`${id}-disadvantage`}
								checked={rollType === "disadvantage"}
								onChange={() => setRollType("disadvantage")}
							/>
							<label htmlFor="disadvantage">Disadvantage</label>
						</div>
					</fieldset>
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
							{value >= 0 ? `+${value}` : value}
						</span>
						Total: {total !== null ? total : ""}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function DieComponent({
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

function rollDie() {
	return Math.floor(Math.random() * 6) + 1;
}
