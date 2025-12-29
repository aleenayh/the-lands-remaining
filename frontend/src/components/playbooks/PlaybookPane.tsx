import { AbilityBoxes } from "./sharedComponents/AbilityBoxes";
import { Cinders } from "./sharedComponents/Cinders";
import { Conditions } from "./sharedComponents/Conditions";
import { ExperienceTracker } from "./sharedComponents/ExperienceTracker";
import { Extras } from "./sharedComponents/Extras";
import { Fires } from "./sharedComponents/Fires";
import { Moves } from "./sharedComponents/Moves";
import { PlayerPill } from "./sharedComponents/PlayerPill";
import { Questions } from "./sharedComponents/Questions";
import { Relics } from "./sharedComponents/Relics";
import { Section } from "./sharedComponents/Section";
import type { Character } from "./types";

export function PlaybookPane({ character }: { character: Character }) {
	return (
		<section
			aria-label={`Ember for ${character.name}`}
			className="border-2 border-theme-border-accent bg-theme-bg-primary rounded-lg p-4 h-full flex flex-col gap-2 overflow-hidden relative"
		>
			<PlayerPill playerId={character.playerId} />
			<h2 className="text-lg whitespace-normal text-balance font-bold text-theme-text-accent shrink-0 truncate mx-10">
				{character.name}
			</h2>
			<div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 flex flex-col gap-0">
				<Section title="Conditions">
					<Conditions character={character} />
				</Section>
				<AbilityBoxes stats={character.abilities} abbreviate />
				<ExperienceTracker character={character} />

				<Section title="Moves" collapsible={true}>
					<Moves character={character} />
				</Section>
				<Section title="Relics & Equipment" collapsible={true}>
					<Relics character={character} />
				</Section>
				<Section title="Fires & Cinders" collapsible={true}>
					<Fires character={character} />
					<Cinders character={character} />
				</Section>
				<Section title="Questions" collapsible={true}>
					<Questions character={character} />
				</Section>
				<Extras character={character} />
			</div>
		</section>
	);
}
