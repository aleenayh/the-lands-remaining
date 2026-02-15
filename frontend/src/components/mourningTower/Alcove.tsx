import { Dialog } from "radix-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGame } from "../../context/GameContext";
import type { Relic } from "../playbooks/types";
import { parseRelicText } from "../playbooks/utils";
import { GlassyButton } from "../shared/GlassyButton";

export function Alcove() {
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const [relicModalOpen, setRelicModalOpen] = useState(false);
	const [shrineModalOpen, setShrineModalOpen] = useState(false);

	const character = gameState.players.find(
		(player) => player.id === id,
	)?.character;
	const equipment = character?.relics.filter(
		(relic) => relic.atAlcove === true,
	);

	const handleRetrieveEquipment = () => {
		if (!character || !character.relics) return;
		const newRelics = [...character.relics];
		for (const item of newRelics) {
			if (item.atAlcove) {
				item.atAlcove = false;
				const aspectLength = item.aspects.length;
				item.aspects = Array.from({ length: aspectLength }, () => 0);
			}
		}
		updateGameState({
			players: gameState.players.map((player) =>
				player.character && player.id === id
					? { ...player, character: { ...player.character, relics: newRelics } }
					: player,
			),
		});
	};

	//static copy version for Keepers
	if (!character)
		return (
			<div className="flex flex-col gap-2 text-sm text-left">
				<h2 className="text-lg font-bold text-theme-text-accent text-center">
					Personal Alcoves
				</h2>
				<p>
					When an Ember visits their Alcove, they may remove a single Relic or
					piece of Equipment and place it in the Alcove. The next time they
					visit their Alcove, they may retrieve the item, which now has all
					Aspects unmarked, and place a new item in the Alcove if they wish.
					Items in the Alcove are not available to be used until they are
					retrieved from it.
				</p>

				<p>
					Additionally, an Ember can establish a personal shrine in their
					Alcove. To do so, they mark an Aspect on their sheet and invite the
					other players and Keeper to create a new narrative prompt in the style
					of those found on The Old Fire sections of the Ember sheets—a
					flashback, essentially. This flashback must be inspired by the marked
					Aspect in some way. This new narrative prompt is part of the Shrine’s
					Fire for that Ember, and can be marked in place of The Old Fire or The
					Fire to Come when stoking the Fire. One new prompt can be added to The
					Shrine’s Fire each time the Alcove is visited, and The Shrine’s Fire
					can have no more than five total prompts (marked and unmarked).{" "}
				</p>

				<p>
					Some Embers have moves that take place at their Alcove. Such Embers
					can do their move in addition to any other actions at their Alcove.
				</p>
			</div>
		);

	return (
		<div className="flex flex-col gap-2 text-sm text-left">
			<h2 className="text-lg font-bold text-theme-text-accent text-center">
				Your Alcove
			</h2>
			<p>
				When visiting your Alcove you may do all of the following: retrieve an
				item from your Alcove, place a new item in your Alcove, pray at your
				personal shrine, perform any Ember moves that take place at your Alcove.
			</p>
			<div className="grid grid-cols-2 gap-2 justify-evenly items-center">
				{equipment?.[0] ? (
					<GlassyButton onClick={() => handleRetrieveEquipment()}>
						Retrieve {equipment[0].title} from your Alcove
					</GlassyButton>
				) : (
					<Dialog.Root open={relicModalOpen} onOpenChange={setRelicModalOpen}>
						<Dialog.Trigger asChild>
							<GlassyButton>Place an item in your Alcove</GlassyButton>
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
									Place an item in your Alcove
								</Dialog.Title>
								<Dialog.Description className="DialogDescription">
									When an Ember visits their Alcove, they may remove a single
									Relic or piece of Equipment and place it in the Alcove. The
									next time they visit their Alcove, they may retrieve the item,
									which now has all Aspects unmarked, and place a new item in
									the Alcove if they wish. Items in the Alcove are not available
									to be used until they are retrieved from it.
								</Dialog.Description>
								<PickRelicForm onClose={() => setRelicModalOpen(false)} />
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
				)}
				<Dialog.Root open={shrineModalOpen} onOpenChange={setShrineModalOpen}>
					<Dialog.Trigger asChild>
						<GlassyButton>Pray at your Personal Shrine</GlassyButton>
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
								Pray at your Personal Shrine
							</Dialog.Title>
							<Dialog.Description className="DialogDescription">
								An Ember can establish a personal shrine in their Alcove. To do
								so, they mark an Aspect on their sheet and invite the other
								players and Keeper to create a new narrative prompt in the style
								of those found on The Old Fire sections of the Ember sheets—a
								flashback, essentially. This flashback must be inspired by the
								marked Aspect in some way. This new narrative prompt is part of
								the Shrine’s Fire for that Ember, and can be marked in place of
								The Old Fire or The Fire to Come when stoking the Fire. One new
								prompt can be added to The Shrine’s Fire each time the Alcove is
								visited, and The Shrine’s Fire can have no more than five total
								prompts (marked and unmarked).
							</Dialog.Description>
							<ShrineForm onClose={() => setShrineModalOpen(false)} />
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			</div>
		</div>
	);
}

function PickRelicForm({ onClose }: { onClose: () => void }) {
	const { register, handleSubmit } = useForm<{ relic: string }>();
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();

	const character = gameState.players.find(
		(player) => player.id === id,
	)?.character;
	const relics = character?.relics;
	if (!character || !relics) return null;

	const onSubmit = (data: { relic: string }) => {
		const newRelics = [...character.relics];
		const relic = newRelics.find((relic) => relic.title === data.relic);
		if (!relic) return;
		relic.atAlcove = true;
		updateGameState({
			players: gameState.players.map((player) =>
				player.character && player.id === id
					? { ...player, character: { ...player.character, relics: newRelics } }
					: player,
			),
		});
		onClose();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
			<p className="text-sm text-left italic">
				Select a Relic or piece of Equipment
			</p>
			<div className="flex flex-col gap-2">
				{relics.map((relic) => (
					<div key={relic.title}>
						<input id={relic.title} type="radio" {...register("relic")} value={relic.title} />
						<label className="cursor-pointer" htmlFor={relic.title}>{relic.title}</label>
					</div>
				))}
			</div>
			<button
				type="submit"
				className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
			>
				Confirm
			</button>
		</form>
	);
}

type ShrineFormInputs = {
	relicTitle?: string;
	relicAspectIdx?: number;
	prompt: string;
};
function ShrineForm({ onClose }: { onClose: () => void }) {
	const { register, handleSubmit, setValue, reset } = useForm<ShrineFormInputs>(
		{
			defaultValues: {
				relicTitle: undefined,
				relicAspectIdx: undefined,
				prompt: "",
			},
		},
	);
	const {
		gameState,
		updateGameState,
		user: { id },
	} = useGame();
	const [step, setStep] = useState<"aspect" | "prompt">("aspect");
	const [displayText, setDisplayText] = useState<string | null>(null);
	const character = gameState.players.find(
		(player) => player.id === id,
	)?.character;
	const shrineFires = character?.shrineFires;
	if (!character) return null;

	const onSubmit = (data: ShrineFormInputs) => {
		const { relicTitle, relicAspectIdx, prompt } = data;
		const newShrineFires = [...(shrineFires ?? [])];
		newShrineFires.push({ text: prompt, marked: false });
		const newRelics = [...character.relics];
		const relic = newRelics.find((relic) => relic.title === relicTitle);
		if (relic && relicAspectIdx !== undefined) {
			relic.aspects[relicAspectIdx] = 1;
		}
		updateGameState({
			players: gameState.players.map((player) =>
				player.character && player.id === id
					? {
							...player,
							character: {
								...character,
								shrineFires: newShrineFires,
								relics: newRelics,
							},
						}
					: player,
			),
		});
		onClose();
	};

	if (shrineFires && shrineFires.length >= 5)
		return (
			<p>
				You have already created five Fires from your Shrine. You cannot create
				more.
			</p>
		);

	const setAspect = (
		title: string,
		idx: number,
		displayText: string | null,
	) => {
		setValue("relicTitle", title);
		setValue("relicAspectIdx", idx);
		setDisplayText(displayText);
		setStep("prompt");
	};

	const backToAspectSelect = () => {
		setStep("aspect");
		reset();
		setDisplayText(null);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
			{step === "aspect" && (
				<div className="flex flex-col gap-2w-full justify-center items-center">
					<h4 className="text-sm font-bold text-theme-text-accent text-left">
						Step 1: Mark an Aspect
					</h4>
					<div className="flex flex-col gap-2">
						{character.relics.map((relic) => (
							<RelicItem
								key={relic.title}
								relic={relic}
								setAspect={setAspect}
							/>
						))}
					</div>
					<p className="text-sm text-left italic mt-4">
						Or click below to skip and do this manually later.
					</p>
					<button
						type="button"
						className="mx-auto bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
						onClick={() => setStep("prompt")}
					>
						Skip
					</button>
				</div>
			)}
			{step === "prompt" && (
				<div className="flex flex-col gap-2 justify-center items-center">
					<h4 className="text-sm font-bold text-theme-text-accent text-left">
						Step 2: Create your Shrine Fire prompt
					</h4>
					{displayText && (
						<p className="text-sm text-left italic">
							Create a flashback inspired by the aspect:{" "}
							<strong>{displayText}</strong>
						</p>
					)}
					<button
						type="button"
						className="text-theme-text-primary rounded-md p-2 w-full text-left"
						onClick={backToAspectSelect}
					>
						{" "}
						← Select a different aspect
					</button>

					<textarea
						{...register("prompt")}
						className="w-full p-2"
						placeholder="Enter a prompt"
					/>

					<button
						type="submit"
						className="bg-theme-bg-accent text-theme-text-primary rounded-md p-2"
					>
						Confirm
					</button>
				</div>
			)}
		</form>
	);
}

function RelicItem({
	relic,
	setAspect,
}: {
	relic: Relic;
	setAspect: (title: string, idx: number, displayText: string | null) => void;
}) {
	const [relicArray, setRelicArray] = useState<number[]>(relic.aspects);

	//create an array of all the text between <aspect> tags
	const aspectTexts = relic.text.match(/<aspect>(.*?)<\/aspect>/g);

	const handleAspectToggle = (idx: number) => {
		const originallyMarked = relic.aspects[idx] === 1;
		if (originallyMarked) return;
		setRelicArray((prev) => {
			const newArray = [...prev];
			newArray[idx] = newArray[idx] === 1 ? 0 : 1;
			return newArray;
		});
		const displayText = aspectTexts
			? aspectTexts[idx]?.replace(/<aspect>|<\/aspect>/g, "")
			: null;
		setAspect(relic.title, idx, displayText);
	};

	return (
		<div className="flex flex-col gap-2 text-left text-xs">
			<strong>{relic.title}</strong>
			<p className="ml-4">
				{parseRelicText(relic.text, relicArray, true, handleAspectToggle)}
			</p>
		</div>
	);
}
