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

export function PlaybookPane({ character }: { character: Character }) {
	return (
		<div className="border-2 border-theme-border-accent rounded-lg p-3 h-full flex flex-col gap-2 overflow-hidden">
			<h2 className="text-lg font-bold text-theme-text-accent shrink-0 truncate">
				{character.name}
			</h2>
			<div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 flex flex-col gap-0">
				<Section title="Conditions">
					<Conditions character={character} />
				</Section>
				<AbilityBoxes stats={character.abilities} />
				<ExperienceTracker character={character} />

				<Section title="Moves" collapsible={true}>
					<Moves character={character} />
				</Section>
				<Section title="Relics" collapsible={true}>
					<Relics character={character} />
				</Section>
				<Section title="Fires & Cinders" collapsible={true}>
					<Fires character={character} />
					<Cinders character={character} />
				</Section>
				<Section title="Questions" collapsible={true}>
					<Questions character={character} />
				</Section>
			</div>
		</div>
	);
}
