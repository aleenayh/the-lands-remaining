import { useId, useState } from "react";
import { type UseFormRegister, useForm } from "react-hook-form";
import { useGame } from "../../../context/GameContext";
import { PlayerRole } from "../../../context/types";
import { playbookBases } from "../content";
import { generateCoreMoveState } from "../coreMoves";
import { Section } from "../sharedComponents/Section";
import type { Abilities, Character, PlaybookBase, playbookKey } from "../types";
import { PencilIconButton } from "./PencilIconButton";

function getRandomValue(array: string[]): string {
	if (array.length === 0) {
		return "";
	}
	const item = array[Math.floor(Math.random() * array.length)];
	return item ?? array[0] ?? "";
}

type CharacterCreateFormInputs = {
	characterName: string;
	honorific: string;
	look1: string;
	look2: string;
	look3: string;
	ritual: string;
	vitality: number;
	composure: number;
	reason: number;
	presence: number;
	cinder: number;
};

export function CharacterCreateForm({
	playbookKey,
}: {
	playbookKey: playbookKey;
}) {
	const { updateGameState, user, gameState } = useGame();
	const base: PlaybookBase = playbookBases[playbookKey];
	const [introExpanded, setIntroExpanded] = useState(true);

	const { register, handleSubmit } = useForm<CharacterCreateFormInputs>({
		defaultValues: {
			characterName: getRandomValue(base.names),
			honorific: getRandomValue(base.honorifics),
			look1: getRandomValue(base.look),
			look2: getRandomValue(base.look),
			look3: getRandomValue(base.look),
			ritual: getRandomValue(base.rituals),
			vitality: base.abilities.vitality,
			composure: base.abilities.composure,
			reason: base.abilities.reason,
			presence: base.abilities.presence,
			cinder: base.abilities.cinder,
		},
	});

	const saveCharacter = (formInputs: CharacterCreateFormInputs) => {
		const character = constructCharacter(
			playbookKey,
			base,
			formInputs,
			user.id,
		);

		const existingPlayerIndex = gameState.players.findIndex(
			(p) => p.id === user.id,
		);

		const updatedPlayers =
			existingPlayerIndex >= 0
				? gameState.players.map((player) =>
						player.id === user.id ? { ...player, character } : player,
					)
				: [
						...gameState.players,
						{
							id: user.id,
							name: user.name,
							online: true,
							role: PlayerRole.PLAYER,
							character,
						},
					];

		updateGameState({ players: updatedPlayers });
	};

	return (
		<form
			onSubmit={handleSubmit(saveCharacter)}
			className="flex flex-col gap-2 justify-center"
		>
			<h1 className="text-2xl font-bold text-center">{base.title}</h1>
			<Section title="Choose A Name">
				<SelectOrEdit
					name="characterName"
					options={base.names}
					register={register}
				/>
				{base.honorifics.length > 0 && (
					<SelectOrEdit
						name="honorific"
						options={base.honorifics}
						register={register}
					/>
				)}
			</Section>

			{/* Looks - 3 */}
			<Section title="Build Your Look">
				<LookSelector options={base.look} register={register} />
			</Section>

			<Section title="Your Story">
				<div className="mt-0 flex flex-col justify-center w-full">
					<button
						type="button"
						onClick={() => setIntroExpanded(!introExpanded)}
					>
						» {introExpanded ? "Collapse" : "Expand"} «
					</button>
					<div
						className={`text-left flex flex-col gap-2 italic transition-all duration-300 overflow-hidden ${introExpanded ? "h-auto opacity-100" : "h-0 opacity-0"}`}
					>
						{base.intro.map((intro) => (
							<p key={intro}>{intro}</p>
						))}{" "}
					</div>
				</div>
			</Section>

			<Section title="Choose A Ritual">
				<SelectOrEdit
					name="ritual"
					options={base.rituals}
					register={register}
				/>
			</Section>

			<Section title="Add 1 to Any Ability">
				<div className="flex justify-center w-full">
					<div className="grid grid-cols-5 gap-1">
						{(
							Object.entries(base.abilities) as [keyof Abilities, number][]
						).map(([stat, value]) => (
							<div
								key={stat}
								className="flex flex-col-reverse md:flex-col gap-1"
							>
								<label htmlFor={stat} className="flex flex-col gap-1">
									<span className="text-xs md:text-sm text-theme-text-muted whitespace-nowrap overflow-hidden text-ellipsis">
										{stat}
									</span>
								</label>
								<input
									id={stat}
									type="number"
									defaultValue={value}
									{...register(stat, { valueAsNumber: true })}
									className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
								/>
							</div>
						))}
					</div>
				</div>
			</Section>

			<button
				type="submit"
				className="bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
			>
				Save Character
			</button>
		</form>
	);
}

type SelectOrEditFieldName = keyof Pick<
	CharacterCreateFormInputs,
	"characterName" | "honorific" | "look1" | "look2" | "look3" | "ritual"
>;

function LookSelector({
	options,
	register,
}: {
	options: string[];
	register: UseFormRegister<CharacterCreateFormInputs>;
}) {
	const [selectedLooks, setSelectedLooks] = useState<string[]>(() => {
		// Initialize with first 3 options (matches default form values)
		return options.slice(0, 3);
	});

	const toggleLook = (option: string) => {
		setSelectedLooks((prev) => {
			if (prev.includes(option)) {
				// Remove if already selected
				return prev.filter((look) => look !== option);
			}
			if (prev.length < 3) {
				// Add if under limit
				return [...prev, option];
			}
			// At limit, replace the oldest selection
			return [...prev.slice(1), option];
		});
	};

	return (
		<>
			{/* Desktop: 3 separate selects */}
			<div className="hidden sm:flex flex-col gap-2 justify-stretch items-stretch w-full">
				<SelectOrEdit name="look1" options={options} register={register} />
				<SelectOrEdit name="look2" options={options} register={register} />
				<SelectOrEdit name="look3" options={options} register={register} />
			</div>

			{/* Mobile: checklist with exactly 3 selections */}
			<div className="sm:hidden flex flex-col gap-1 w-full">
				{/* Hidden inputs to sync with react-hook-form */}
				<input
					type="hidden"
					{...register("look1")}
					value={selectedLooks[0] ?? ""}
				/>
				<input
					type="hidden"
					{...register("look2")}
					value={selectedLooks[1] ?? ""}
				/>
				<input
					type="hidden"
					{...register("look3")}
					value={selectedLooks[2] ?? ""}
				/>

				<p className="text-sm text-theme-text-muted mb-1">
					Select 3 ({selectedLooks.length}/3)
				</p>

				{options.map((option) => {
					const isSelected = selectedLooks.includes(option);
					return (
						<button
							key={option}
							type="button"
							onClick={() => toggleLook(option)}
							className={`flex items-start gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
								isSelected
									? "bg-theme-bg-accent text-theme-text-accent"
									: "bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent/50"
							}`}
						>
							<span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
								{isSelected && "✓"}
							</span>
							<span className="whitespace-normal">{option}</span>
						</button>
					);
				})}
			</div>
		</>
	);
}

function SelectOrEdit({
	options,
	name,
	register,
}: {
	options: string[];
	name: SelectOrEditFieldName;
	register: UseFormRegister<CharacterCreateFormInputs>;
}) {
	const id = useId();
	const [isEditing, setIsEditing] = useState(false);
	const { ref, onChange, ...rest } = register(name);

	if (options.length === 0) {
		return (
			<input
				{...register(name)}
				type="text"
				className="border px-2 py-1 flex-grow"
			/>
		);
	}

	return (
		<div className="inline-flex items-center gap-1 flex-grow">
			{isEditing ? (
				<input
					{...rest}
					ref={(input) => {
						ref(input);
						input?.focus();
					}}
					id={id}
					type="text"
					onChange={onChange}
					onBlur={() => setIsEditing(false)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === "Escape") {
							setIsEditing(false);
						}
					}}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				/>
			) : (
				<select
					{...register(name)}
					id={id}
					className="border px-2 py-1 rounded-lg bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-bg-accent hover:text-theme-text-accent flex-grow"
				>
					{options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			)}
			<PencilIconButton isEditing={isEditing} setIsEditing={setIsEditing} />
		</div>
	);
}

function constructCharacter(
	playbookKey: playbookKey,
	base: PlaybookBase,
	formInputs: CharacterCreateFormInputs,
	playerId: string,
): Character {
	const {
		ritual,
		look1,
		look2,
		look3,
		characterName,
		honorific,
		vitality,
		composure,
		reason,
		presence,
		cinder,
	} = formInputs;

	// Count total aspects across all relics to initialize the array
	const relicAspects = constructAspectArray(base.relics);

	const conditions: string[] = ["", "", ""];

	const advancements: Record<number, boolean> = {
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false,
		7: false,
		8: false,
		9: false,
	};

	const coreMoveState = generateCoreMoveState(playbookKey);

	return {
		playbook: playbookKey,
		playerId,
		name: `${characterName} ${honorific}`,
		look: `${look1.charAt(0).toUpperCase() + look1.slice(1)}, ${look2}, ${look3}`,
		ritual,
		abilities: {
			vitality: Number(vitality),
			composure: Number(composure),
			reason: Number(reason),
			presence: Number(presence),
			cinder: Number(cinder),
		},
		cinders: Object.fromEntries(
			Object.keys(base.cinders).map((key) => [key, false]),
		),
		relics: base.relics,
		relicAspects,
		oldFire: 0,
		fireToCome: 0,
		advancements,
		conditions,
		moves: [],
		coreMoveState,
		experience: 0,
		questions: Object.fromEntries(
			Object.keys(base.questions).map((key) => [parseInt(key, 10), false]),
		),
	};
}

export function constructAspectArray(relics: { text: string }[]): number[] {
	const aspectCount = relics.reduce((count, relic) => {
		const matches = relic.text.match(/<aspect>/g);
		return count + (matches?.length ?? 0);
	}, 0);
	return Array(aspectCount).fill(0);
}
