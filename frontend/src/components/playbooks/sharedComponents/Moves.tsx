import { playbookBases } from "../content";
import { coreMoves } from "../coreMoves";
import type { Character } from "../types";

export function Moves({ character }: { character: Character }) {
	const coreMove = coreMoves(character)[character.playbook];
	const otherMoves = character.moves ? character.moves : [];
	const moveContent = playbookBases[character.playbook].moves;

	return (
		<div className="text-sm">
			{coreMove}
			<div className="h-6" />
			{otherMoves.length > 0 &&
				otherMoves.map((move) => {
					const content = move.text
						? move.text
						: moveContent.find((m) => m.title === move.title)?.text;
					if (!content) {
						return null;
					}
					return (
						<div key={move.title} className="flex flex-col justify-center">
							<h3>{move.title}</h3>
							{content.map((line) => {
								return (
									<div className="text-left" key={line}>
										{line}
									</div>
								);
							})}
							<div className="h-6" />
						</div>
					);
				})}
		</div>
	);
}
