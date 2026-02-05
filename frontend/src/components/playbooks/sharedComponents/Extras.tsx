import { useGame } from "../../../context/GameContext";
import { Section } from "../../shared/Section";
import { playbookBases } from "../content";
import { coreMoveTitles } from "../coreMoves";
import { type Character, type playbookKey, playbookKeys } from "../types";

export function Extras({ character }: { character: Character }) {
	const { user } = useGame();
	const isMe = user.id === character.playerId;
	const base = playbookBases[character.playbook];
	return (
		<div className="flex flex-col gap-2 text-left">
			<div className="grid grid-cols-[auto_1fr] gap-2">
				<h3 className="text-sm font-bold text-theme-text-accent">Ritual:</h3>
				<p className="text-sm text-theme-text-primary">{character.ritual}</p>
				<h3 className="text-sm font-bold text-theme-text-accent">Look:</h3>
				<p className="text-xs text-theme-text-secondary">{character.look}</p>
				{character.pronouns && (
					<h3 className="text-sm font-bold text-theme-text-accent">
						Pronouns:
					</h3>
				)}
				{character.pronouns && (
					<p className="text-sm text-theme-text-secondary">
						{character.pronouns}
					</p>
				)}
			</div>
			{character.playbook !== playbookKeys.custom && (
				<Section
					title="Story"
					collapsible={true}
					minify={!isMe}
					leftAlign={!isMe}
				>
					<div className="flex flex-col gap-2 text-sm text-theme-text-secondary">
						{base.intro.map((intro) => (
							<p key={intro}>{intro}</p>
						))}
						<Vows playbook={character.playbook} />
					</div>
				</Section>
			)}
		</div>
	);
}

export function Vows({
	playbook,
}: {
	playbook: Exclude<playbookKey, "custom">;
}) {
	const base = playbookBases[playbook];
	let coreMoveTitle: string | string[] = coreMoveTitles[playbook];
	if (coreMoveTitle.includes("&")) {
		coreMoveTitle = coreMoveTitle.split("&").map((title) => title.trim());
	}
	const vows = [
		...(Array.isArray(coreMoveTitle) ? coreMoveTitle : [coreMoveTitle]),
		...base.moves.map((move) => move.title),
	];
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
