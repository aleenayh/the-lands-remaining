import { Dialog } from "radix-ui";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useGame } from "../../../context/GameContext";
import { colorFromTheme } from "../../colors";
import { EditableLine } from "../../shared/EditableLine";
import type { Character } from "../types";
import { Flame } from "./candle/Flame";

export function CoreMoveCandleBearer({ character }: { character: Character }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const { coreMoveState } = character;

	const toggleWax = useCallback(
		(toggled: boolean) => {
			if (coreMoveState.type !== "candle-bearer") return;

			updateGameState({
				players: gameState.players.map((player) =>
					player.id === id && player.character
						? {
								...player,
								character: {
									...player.character,
									coreMoveState: {
										...coreMoveState,
										wax: toggled
											? coreMoveState.wax + 1
											: coreMoveState.wax - 1,
									},
								},
							}
						: player,
				),
			});
		},
		[updateGameState, gameState.players, id, coreMoveState],
	);

	if (coreMoveState.type !== "candle-bearer") return null;
	return (
		<div className="flex flex-col gap-2 text-left">
			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				The Waxen Order Keeps the Flame…
			</h3>
			<p>
				You have the tools and ingredients necessary to craft magical candles.
				Whenever you take a few hours to do so, mark Wax below and roll with
				Cinder.
			</p>
			<ul className="list-disc list-inside ml-4">
				<li>
					On a 10+, you create a candle; pick an Aspect from the list below and
					write it on an empty candle space.
				</li>
				<li>
					On a 7-9, as above, but the Keeper will also pick a complication;
					write it below the Aspect.
				</li>
				<li>
					On a miss, as 7-9, but the candle is poorly made; cross out two of the
					boxes.
				</li>
				<li>On a 12+, create two candles (the same or different).</li>
			</ul>
			<p>
				So long as you let the candle burn for a short period of time, you get
				access to whatever feat or benefit is implied by the candle’s Aspect,
				with no need to mark the Aspect, and are also subject to any
				complications while burning it. The Aspect can be marked to get the
				normal mechanical benefits of marking an Aspect. You lose the candle
				once all boxes are marked.
			</p>
			<h3 className="text-center font-bold text-theme-text-accent">Aspects:</h3>
			<ul className="list-disc list-inside ml-4">
				{aspects.map((aspect, index) => (
					<li
						key={`aspect-${
							// biome-ignore lint/suspicious/noArrayIndexKey: order unimportant
							index
						}`}
					>
						{aspect}
					</li>
				))}
			</ul>
			<h3 className="text-center font-bold text-theme-text-accent">
				Complications:
			</h3>
			<Complications character={character} />
			<h3 className="text-center font-bold text-theme-text-accent">Wax</h3>
			<div className="flex gap-2 justify-center items-center">
				{Array.from({ length: 3 }).map((_, index) => (
					<input
						type="checkbox"
						key={`wax-${
							// biome-ignore lint/suspicious/noArrayIndexKey: order unimportant
							index
						}`}
						disabled={!editable}
						checked={index < coreMoveState.wax}
						onChange={(e) => toggleWax(e.target.checked)}
					/>
				))}
			</div>
			<h3 className="text-center font-bold text-theme-text-accent">Candles</h3>
			{Object.entries(coreMoveState.candles).map(([indexString, candle]) => {
				const index = parseInt(indexString, 10);
				const blank = candle.aspect === "";
				if (blank) {
					if (!editable) return <div key={`candle-create-form-${index}`} />;
					return (
						<CandleCreateForm
							character={character}
							index={index}
							key={`candle-create-form-${index}`}
						/>
					);
				}
				return (
					<Candle character={character} key={`candle-${index}`} index={index} />
				);
			})}

			<p>
				To replenish your Wax, you must render the fat of a magical creature.
				When you take a few hours to do so, unmark all Wax and work with the
				Keeper to define a new complication that might arise because of the
				source of the Wax, and write it on a blank line under complications,
				above. Once all complications are filled in, if you ever need to add a
				new one, stoke the Fire and then replace an existing complication with
				the new one.
			</p>
		</div>
	);
}
const aspects = [
	"Bar a place or portal to [a specific person or type of non-human creature]",
	"Stare into the flame to observe another place or time",
	"The flame causes someone looking at it to be open to suggestion",
	"The candle’s scent causes everyone in a small space to fall asleep",
	"Light and shadow warp into an illusion of an object or non-human creature",
];

function Complications({ character }: { character: Character }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const { coreMoveState } = character;
	if (coreMoveState.type !== "candle-bearer") return null;

	const handleSaveComplication = (index: number, value: string) => {
		const newComplications = [...coreMoveState.complications];
		newComplications[index] = value;
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === id && player.character
					? {
							...player,
							character: {
								...player.character,
								coreMoveState: {
									...coreMoveState,
									complications: newComplications,
								},
							},
						}
					: player,
			),
		});
	};

	return (
		<div className="flex flex-col gap-1 text-sm w-[70%] ml-4">
			{Array.from({ length: 5 }).map((_, index) => {
				const complication = coreMoveState.complications?.[index] ?? "";
				return (
					<EditableLine
						key={`complication-${index}-${complication}}`}
						text={complication}
						editable={editable}
						onSave={handleSaveComplication}
						index={index}
					/>
				);
			})}
		</div>
	);
}

type CandleCreateFormInputs = {
	aspect: string;
	complication: string;
};

function CandleCreateForm({
	character,
	index,
}: {
	character: Character;
	index: number;
}) {
	const { coreMoveState } = character;
	const { gameState, updateGameState } = useGame();
	const [open, setOpen] = useState(false);
	const { register, handleSubmit } = useForm<CandleCreateFormInputs>({
		defaultValues: {
			aspect: "",
			complication: "no-complication",
		},
	});
	if (coreMoveState.type !== "candle-bearer") return null;
	const { complications } = coreMoveState;

	const onSubmit = (data: CandleCreateFormInputs) => {
		const newCandle = {
			checks: 0,
			aspect: data.aspect,
			complication:
				data.complication === "no-complication" ? "" : data.complication,
		};
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId && player.character
					? {
							...player,
							character: {
								...player.character,
								coreMoveState: {
									...coreMoveState,
									candles: { ...coreMoveState.candles, [index]: newCandle },
								},
							},
						}
					: player,
			),
		});
		setOpen(false);
	};

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="bg-theme-bg-secondary hover:bg-theme-bg-accent hover:text-theme-text-accent text-theme-text-primary px-4 py-2 rounded-md"
				>
					Create Candle
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
					<Dialog.Title className="DialogTitle">Create Candle</Dialog.Title>
					<form onSubmit={handleSubmit(onSubmit)} className="text-sm">
						<h3 className="text-center font-bold text-theme-text-accent">
							Select an Aspect
						</h3>
						{aspects.map((aspect, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: order unimportant
							<div key={`aspect-${index}`}>
								<input type="radio" value={aspect} {...register("aspect")} />
								<label htmlFor={`aspect-${index}`}>{aspect}</label>
							</div>
						))}
						<h3 className="text-center font-bold text-theme-text-accent">
							Have your Keeper Select a Complication
						</h3>
						<p className="text-center text-sm italic text-theme-text-secondary">
							(on a roll of 9 or lower)
						</p>
						<ul className="list-disc list-inside ml-4">
							<input
								type="radio"
								value="no-complication"
								{...register("complication")}
							/>
							<label htmlFor="complication-1">None</label>
							{complications
								.filter((complication) => complication !== "")
								.map((complication, index) => (
									<div
										key={`complication-${
											// biome-ignore lint/suspicious/noArrayIndexKey: order unimportant
											index
										}`}
									>
										<input
											type="radio"
											value={complication}
											{...register("complication")}
										/>
										<label htmlFor={`complication-${index}`}>
											{complication}
										</label>
									</div>
								))}
						</ul>
						<div className="flex justify-center w-full">
							<button
								type="submit"
								className="bg-theme-bg-primary hover:bg-theme-bg-accent hover:text-theme-text-accent text-theme-text-primary px-4 py-2 rounded-md"
							>
								Create Candle
							</button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function Candle({ character, index }: { character: Character; index: number }) {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const editable = id === character.playerId;
	const { coreMoveState } = character;
	if (coreMoveState.type !== "candle-bearer") return null;

	const candle = coreMoveState.candles[index];

	const markCandle = (marked: boolean) => {
		const newCandle = {
			...candle,
			checks: marked ? candle.checks + 1 : candle.checks - 1,
		};
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId && player.character
					? {
							...player,
							character: {
								...player.character,
								coreMoveState: {
									...coreMoveState,
									candles: { ...coreMoveState.candles, [index]: newCandle },
								},
							},
						}
					: player,
			),
		});
	};
	const removeCandle = () => {
		const newCandles = { ...coreMoveState.candles };
		const blankCandle = {
			checks: 0,
			aspect: "",
			complication: "",
		};
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId && player.character
					? {
							...player,
							character: {
								...player.character,
								coreMoveState: {
									...coreMoveState,
									candles: { ...newCandles, [index]: blankCandle },
								},
							},
						}
					: player,
			),
		});
	};
	return (
		<div className="flex gap-0 text-left items-center border border-theme-border-accent rounded-md px-2">
			<div className="w-auto flex items-start justify-start mb-2">
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={`check-${
							// biome-ignore lint/suspicious/noArrayIndexKey: order unimportant
							index
						}`}
						className="relative flex flex-col"
					>
						{candle.checks >= index + 1 ? (
							<div className="h-8 w-8 flex justify-center items-center -ml-[0.50rem] mt-2">
								<Flame color={colorFromTheme()} />
							</div>
						) : (
							<div className="h-8 w-8 flex justify-center items-center -ml-[0.50rem] mt-2" />
						)}

						<input
							type="checkbox"
							disabled={!editable}
							checked={candle.checks >= index + 1}
							className={"h-24 w-8 aspect-auto"}
							onChange={(e) => markCandle(e.target.checked)}
						/>
					</div>
				))}
			</div>
			<div className="w-4/5 flex flex-col justify-start items-start text-left">
				<p>
					{candle.aspect}
					{candle.complication &&
						`, and ${candle.complication.charAt(0).toLowerCase() + candle.complication.slice(1)}`}
					{candle.checks >= 3 && (
						<button
							type="button"
							className="ml-4 bg-theme-bg-secondary text-xs hover:bg-theme-bg-accent hover:text-theme-text-accent text-theme-text-primary rounded-lg px-2"
							onClick={() => removeCandle()}
						>
							REMOVE
						</button>
					)}
				</p>
			</div>
		</div>
	);
}
