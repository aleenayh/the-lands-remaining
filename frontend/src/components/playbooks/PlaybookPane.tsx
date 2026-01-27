import { DecorativeBorder } from "../shared/DecorativeBorder";
import { Divider } from "../shared/Divider";
import { Section } from "../shared/Section";
import { AbilityBoxes } from "./sharedComponents/AbilityBoxes";
import { Cinders } from "./sharedComponents/Cinders";
import { Conditions } from "./sharedComponents/Conditions";
import { ExperienceTracker } from "./sharedComponents/ExperienceTracker";
import { Extras } from "./sharedComponents/Extras";
import { Fires } from "./sharedComponents/Fires";
import { Moves } from "./sharedComponents/Moves";
import { DiceIndicator, PlayerPill } from "./sharedComponents/PlayerPill";
import { Questions } from "./sharedComponents/Questions";
import { Relics } from "./sharedComponents/Relics";
import type { Character } from "./types";

export function PlaybookPane({ character }: { character: Character }) {
	return (
		<DecorativeBorder className="bg-theme-bg-primary flex flex-col gap-2">
			<div className="w-full grid grid-cols-[.25fr_auto_.25fr] items-center">
				<DiceIndicator playerId={character.playerId} />
				<h2 className="text-lg whitespace-normal text-balance font-bold text-theme-text-accent shrink-0 truncate mx-10">
					{character.name}
				</h2>
				<PlayerPill playerId={character.playerId} />
			</div>
			<div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 flex flex-col gap-0">
				<Section title="Conditions">
					<Conditions character={character} />
				</Section>
				<AbilityBoxes stats={character.abilities} abbreviate />
				<ExperienceTracker character={character} />
				<Section title="Moves" collapsible>
					<Moves character={character} />
					<Divider />
				</Section>
				<Section title="Relics & Equipment" collapsible>
					<Relics character={character} />
					<Divider />
				</Section>
				<Section title="Fires & Cinders" collapsible>
					<Fires character={character} />
					<Divider />
					<Cinders character={character} />
					<Divider />
				</Section>
				<Section title="Questions" collapsible>
					<Questions character={character} />
					<Divider />
				</Section>
				<Extras character={character} />
			</div>
		</DecorativeBorder>
	);
}
