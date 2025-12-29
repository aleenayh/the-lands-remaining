import { playbookBases } from "../content";
import { coreMoveTitles } from "../coreMoves";
import { type Character, type playbookKey, playbookKeys } from "../types";
import { Section } from "./Section";

export function Extras({ character }: { character: Character }) {
	const base = playbookBases[character.playbook];
	return (
		<div className="flex flex-col gap-2 text-left">
			<div className="grid grid-cols-[auto_1fr] gap-2">
				<h3 className="text-sm font-bold text-theme-text-accent">Ritual:</h3>
				<p className="text-sm text-theme-text-primary">{character.ritual}</p>
				<h3 className="text-sm font-bold text-theme-text-accent">Look:</h3>
				<p className="text-xs text-theme-text-secondary">{character.look}</p>
			</div>
			<Section title="Story" collapsible={true}>
				<div className="flex flex-col gap-2 text-sm text-theme-text-secondary">
					{base.intro.map((intro) => (
						<p key={intro}>{intro}</p>
					))}
					<Vows playbook={character.playbook} />
				</div>
			</Section>
		</div>
	);
}

export function Vows({ playbook }: { playbook: playbookKey }) {
	const base = playbookBases[playbook];
	const coreMoveTitle =
		playbook === playbookKeys.cruxDruid
			? ["Do Not Let Me Hang Alone…", "…Plant Me Where My Power Can Grow."]
			: [coreMoveTitles[playbook]];
	const vows = [...coreMoveTitle, ...base.moves.map((move) => move.title)];
	return (
		<div className="flex flex-col justify-center items-center gap-0 text-left">
			{vows.map((vow) => (
				<p
					key={vow}
					className="text-sm text-theme-text-primary leading-relaxed italic"
				>
					{vow}
				</p>
			))}
		</div>
	);
}
