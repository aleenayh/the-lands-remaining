import { useGame } from "../../../context/GameContext";
import { PlayerRole } from "../../../context/types";
import { EditableLine } from "../../shared/EditableLine";
import type { Character } from "../types";

export function Conditions({ character }: { character: Character }) {
	const {
		updateGameState,
		gameState,
		user: { id, role },
	} = useGame();
	const editable = id === character.playerId || role === PlayerRole.KEEPER;

	const handleSaveCondition = (index: number, value: string) => {
		const newConditions = [...character.conditions];
		newConditions[index] = value;
		updateGameState({
			players: gameState.players.map((player) =>
				player.id === character.playerId
					? {
							...player,
							character: player.character
								? { ...player.character, conditions: newConditions }
								: null,
						}
					: player,
			),
		});
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			{Array.from({ length: 3 }).map((_, index) => {
				const condition = character.conditions?.[index] ?? "";
				return (
					<EditableLine
						key={`condition-${index}-${condition}}`}
						text={condition}
						editable={editable}
						onSave={handleSaveCondition}
						index={index}
					/>
				);
			})}
		</div>
	);
}
