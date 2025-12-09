import { useMemo, useState } from "react";
import { AdvancementTab } from "./advancement/AdvancementTab";
import { AbilityBoxes } from "./sharedComponents/AbilityBoxes";
import { Cinders } from "./sharedComponents/Cinders";
import { Conditions } from "./sharedComponents/Conditions";
import { ExperienceTracker } from "./sharedComponents/ExperienceTracker";
import { Fires } from "./sharedComponents/Fires";
import { Moves } from "./sharedComponents/Moves";
import { Questions } from "./sharedComponents/Questions";
import { Relics } from "./sharedComponents/Relics";
import { Section } from "./sharedComponents/Section";
import type { Character } from "./types";

const tabsConfig = (character: Character) => [
	{
		label: "Moves",
		component: <Moves character={character} />,
	},
	{
		label: "Relics",
		component: <Relics character={character} />,
	},
	{
		label: "Fires",
		component: <Fires character={character} />,
	},
	{
		label: "Cinders",
		component: <Cinders character={character} />,
	},
	{
		label: "Questions",
		component: <Questions character={character} />,
	},
	{
		label: "Advance",
		component: <AdvancementTab />,
	},
];
export function PlaybookExpanded({ character }: { character: Character }) {
	const tabs = useMemo(() => {
		return tabsConfig(character);
	}, [character]);
	const [activeTab, setActiveTab] = useState<keyof typeof tabs>(
		tabs[1].label as keyof typeof tabs,
	);

	return (
		<div className="border-2 border-theme-border-accent rounded-lg p-4 h-full flex flex-col gap-2 overflow-hidden">
			<h1 className="text-2xl font-bold text-center text-theme-text-accent shrink-0 break-words">
				{character.name}
			</h1>
			<div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 flex flex-col gap-3">
				<Section title="Conditions">
					<Conditions character={character} />
				</Section>

				<AbilityBoxes stats={character.abilities} />
				<ExperienceTracker character={character} />

				<div className="flex gap-1 justify-center text-md flex-wrap">
					{tabs.map((tab) => (
						<button
							type="button"
							className={
								activeTab === tab.label
									? "bg-theme-bg-accent text-theme-text-accent border-theme-border-accent border-2 rounded-lg p-1"
									: "bg-theme-bg-secondary text-theme-text-secondary border-theme-bg-primary border-2 rounded-lg p-1"
							}
							onClick={() => setActiveTab(tab.label as keyof typeof tabs)}
							key={tab.label}
						>
							{tab.label}
						</button>
					))}
				</div>
				{tabs.find((tab) => tab.label === activeTab)?.component}
			</div>
		</div>
	);
}
