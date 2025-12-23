import { useState } from "react";
import { useGame } from "../../../context/GameContext";
import { ReactComponent as SaplingSvg } from "../../assets/sapling.svg";
import { PencilIconButton } from "../creation/PencilIconButton";
import { BlankCondition, ConditionInput } from "../sharedComponents/Conditions";
import type { Character } from "../types";

export function CoreMoveCruxDruid({ character }: { character: Character }) {
	const {
		updateGameState,
		gameState,
		user: { id },
	} = useGame();
	if (character.coreMoveState.type !== "crux-druid") return null;
	const stigma = character.coreMoveState.checks;
	const editable = id === character.playerId;

	const toggleStigma = (checked: boolean) => {
		if (!editable) return;
		if (character.coreMoveState.type !== "crux-druid") return;
		const coreMoveState = character.coreMoveState;
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: {
								...character,
								coreMoveState: {
									...coreMoveState,
									checks: checked ? stigma + 1 : stigma - 1,
								},
							},
						}
					: player,
			),
		});
	};

	const handleSaplingChange = (key: string, value: string) => {
		if (!editable) return;
		if (character.coreMoveState.type !== "crux-druid") return;
		const coreMoveState = character.coreMoveState;
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === id
					? {
							...player,
							character: {
								...character,
								coreMoveState: {
									...coreMoveState,
									sapling: { ...coreMoveState.sapling, [key]: value },
								},
							},
						}
					: player,
			),
		});
	};

	const handleBodyPartChange = (index: number, value: string) => {
		if (!editable) return;
		if (character.coreMoveState.type !== "crux-druid") return;
		const coreMoveState = character.coreMoveState;
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: {
								...character,
								coreMoveState: {
									...coreMoveState,
									bodyParts: { ...coreMoveState.bodyParts, [index]: value },
								},
							},
						}
					: player,
			),
		});
	};
	return (
		<div className="flex flex-col gap-2 items-center text-left">
			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				“Do Not Let Me Hang Alone…”
			</h3>
			<p>
				While on a Journey, you can say that a named Side Character or
				Supplicant meets you in secret. If you do, say who it is, and then roll
				with Cinder; if it’s a Supplicant, the result is automatically 10+. On a
				10+, they are a willing martyr; describe how they abase themselves
				before you and then make them an Oracle, following the procedure below.
				On a 7-9, they have not yet learned their martyrdom, or are there to
				kill you; you must roll the Dark Move in order to make them an Oracle.
				On a miss, as 7-9 above, but they are a poor sacrifice; if you make them
				an Oracle, they only have 1 checkbox.{" "}
			</p>

			<p>
				Whether willing or unwilling, Oracles are people you crucify to sacred
				trees. When you make an Oracle, describe the horror of the process, and
				then write their name on the Journey sheet and draw six checkboxes below
				it; there can only be one Oracle attached to each Journey. Thereafter,
				each time you make that Journey, you can mark a single checkbox to
				decipher the shrieks, groans, and tortured babbling of the Oracle to
				learn the secrets of the trees: the Keeper will give you a Clue for an
				active Mystery. After a Journey is complete, you can continue to make it
				for purposes of consulting its Oracle, but you must make the Journey
				alone.{" "}
			</p>

			<p>
				Creating and consulting an Oracle is always a secret—but an open secret.
				If other Embers on the Journey want to accompany you to a sacred tree,
				or even follow you surreptitiously, you, as a player, must first agree
				to it.{" "}
			</p>

			<p>
				If you have multiple moves that let you interact with an Oracle, you can
				do each interaction once per Journey.{" "}
			</p>

			<p>
				When all Oracle checkboxes are marked, the Oracle expires; mark a box on
				Stigma. Additionally, the following is added to all remaining prompts on
				that Journey: “How has the Crux Druid’s rite affected the land?”{" "}
			</p>

			<p>
				When Stigma is full, tell the Keeper they can force you—and any Embers
				with you—into a Struggle with Grand Inquisitor Arbol as a reaction.
				Until this Struggle takes place, ignore any move instructions to mark
				Stigma.{" "}
			</p>

			<h3 className="text-center text-md font-bold text-theme-text-accent">
				Stigma
			</h3>
			<div className="flex gap-2 justify-center">
				{Array.from({ length: 9 }).map((_, index) => (
					<input
						type="checkbox"
						disabled={!editable}
						checked={stigma >= index + 1}
						key={`stigma-${index}-${stigma}}`}
						onChange={(e) => toggleStigma(e.target.checked)}
					/>
				))}
			</div>

			<h3 className="text-sm font-bold text-theme-text-accent text-center">
				“...Plant Me Where My Power Can Grow.”
			</h3>
			<p>
				You have a sacred ash sapling in your Alcove at the Mourning Tower.
				While on a Journey that has an Oracle, you can mark 3 boxes (or however
				many boxes remain if less than 3) to claim an organ or other body part
				from the Oracle; describe the process and note it on one of the lines
				below. What do you replace the missing part with?
			</p>
			<ul className="list-disc list-inside ml-2 text-left">
				<li>A pumpkin carved in its likeness.</li>
				<li>A bolus of juniper, pine, and holly.</li>
				<li>A wicker facsimile of what you took.</li>
				<li>A mixture of pine tar, sap, and resin.</li>
				<li>Something else.</li>
			</ul>
			<BodyPartList
				character={character}
				handleBodyPartChange={handleBodyPartChange}
			/>

			<p>
				When at your Alcove, you can graft one of these parts to the sapling. If
				you do so, clear it from the list of parts and add it to one of the
				lines on the sapling; narrate a prophecy showing how this specific graft
				will someday help the sapling reshape the world. Additionally, the
				sapling will have a connection to one of your Oracles. Write the name of
				the Oracle below. Whenever you graft a part to the sapling, the Oracle
				is soothed; unmark one of their boxes on the Journey sheet. You are able
				to mark The Pyre’s Crown once the sapling is fully grafted.
			</p>

			<Sapling
				character={character}
				handleSaplingChange={handleSaplingChange}
			/>
		</div>
	);
}

function BodyPartList({
	character,
	handleBodyPartChange,
}: {
	character: Character;
	handleBodyPartChange: (index: number, value: string) => void;
}) {
	const [showEdit, setShowEdit] = useState<boolean[]>(Array(6).fill(false));
	const {
		gameState,
		user: { id },
	} = useGame();
	const editable = gameState.players.some(
		(player) => player.id === id && player.character?.playbook === "crux-druid",
	);
	const bodyParts =
		character.coreMoveState.type === "crux-druid"
			? character.coreMoveState.bodyParts
			: [];
	if (character.coreMoveState.type !== "crux-druid") return null;

	const handleSaveCondition = (index: number, value: string) => {
		handleBodyPartChange(index, value);
	};
	return (
		<div className="flex flex-col gap-2 w-full">
			<h3 className="text-center text-md font-bold text-theme-text-accent">
				Body Parts
			</h3>
			<div className="w-full flex flex-col gap-2 px-2">
				{Array.from({ length: 6 }).map((_, index) => {
					const viscera = bodyParts[index] ?? "";
					const showBlank = viscera === "";
					return (
						<div
							key={`viscera-${index}-${viscera}}`}
							className="w-full min-w-0 flex justify-between items-center gap-2"
						>
							{showEdit[index] ? (
								<ConditionInput
									condition={viscera}
									onSave={(value) => handleSaveCondition(index, value)}
								/>
							) : (
								<div className="flex-1 min-w-0 flex gap-2 items-center">
									{showBlank ? (
										<BlankCondition />
									) : (
										<span className="text-md text-theme-text-primary break-words overflow-wrap-anywhere">
											{viscera}
										</span>
									)}
								</div>
							)}
							{editable && (
								<PencilIconButton
									isEditing={showEdit[index]}
									setIsEditing={() =>
										setShowEdit({ ...showEdit, [index]: !showEdit[index] })
									}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function Sapling({
	character,
	handleSaplingChange,
}: {
	character: Character;
	handleSaplingChange: (key: string, value: string) => void;
}) {
	if (character.coreMoveState.type !== "crux-druid") return null;
	const {
		sapling: { roots, trunk, bark, sap, branches, leaves, connection },
	} = character.coreMoveState;

	return (
		<div className="flex flex-col md:grid md:grid-cols-[2fr_1fr_2fr] gap-2 px-2">
			<h2 className="text-center col-span-3 text-lg font-bold text-theme-text-accent">
				Sacred Ash Sapling
			</h2>
			<div className="flex flex-col gap-3">
				<SaplingInput
					label="Branches"
					value={branches}
					onChange={(value) => {
						handleSaplingChange("branches", value);
					}}
				/>
				<div className="pl-0 md:pl-3">
					<SaplingInput
						label="Trunk"
						value={trunk}
						onChange={(value) => {
							handleSaplingChange("trunk", value);
						}}
					/>
				</div>
				<SaplingInput
					label="Sap"
					value={sap}
					onChange={(value) => {
						handleSaplingChange("sap", value);
					}}
				/>
			</div>
			<SaplingSvg
				aria-label="Sapling"
				className="text-theme-text-accent h-full w-auto justify-self-center hidden md:block"
			/>
			<div className="flex flex-col gap-3">
				<SaplingInput
					label="Leaves"
					value={leaves}
					onChange={(value) => {
						handleSaplingChange("leaves", value);
					}}
				/>
				<div className="ml:0 md:-ml-3">
					<SaplingInput
						label="Bark"
						value={bark}
						onChange={(value) => {
							handleSaplingChange("bark", value);
						}}
					/>
				</div>
				<SaplingInput
					label="Roots"
					value={roots}
					onChange={(value) => {
						handleSaplingChange("roots", value);
					}}
				/>
			</div>

			<div className="col-span-3 inline-flex items-center gap-2">
				Connected to:{" "}
				<SaplingInput
					label="Connection"
					value={connection}
					onChange={(value) => handleSaplingChange("connection", value)}
				/>
			</div>
		</div>
	);
}

function SaplingInput({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const {
		gameState,
		user: { id },
	} = useGame();
	const [showEdit, setShowEdit] = useState(false);
	const editable = gameState.players.some(
		(player) => player.id === id && player.character?.playbook === "crux-druid",
	);
	const showBlank = value === "";

	return (
		<div className="shrink-0 flex flex-col gap-0">
			{label !== "Connection" && (
				<p className="text-xs italic text-theme-text-muted text-left">
					{label.toLowerCase()}
				</p>
			)}
			<div
				key={`sapling-${label}-${value}}`}
				className="w-full min-w-0 flex justify-between items-center gap-2"
			>
				{showEdit ? (
					<ConditionInput
						condition={value}
						onSave={(value) => onChange(value)}
					/>
				) : (
					<div className="flex-1 min-w-0 flex gap-2 items-center">
						{showBlank ? (
							<BlankCondition />
						) : (
							<span className="text-md text-theme-text-primary break-words overflow-wrap-anywhere">
								{value}
							</span>
						)}
					</div>
				)}
				{editable && (
					<PencilIconButton
						isEditing={showEdit}
						setIsEditing={() => setShowEdit(!showEdit)}
					/>
				)}
			</div>
		</div>
	);
}
