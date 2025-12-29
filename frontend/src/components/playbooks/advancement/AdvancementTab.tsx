import { Extras } from "../sharedComponents/Extras";
import type { Character } from "../types";
import { AdjustmentModal } from "./AdjustModal";
import { AdvancementModal } from "./AdvancementModal";
import { AscendTheThroneModal } from "./AscendModal";
import { RetireCharacterModal } from "./RetireModal";
import { RewardModal } from "./RewardModal";

export function AdvancementTab({ character }: { character: Character }) {
	return (
		<div className="flex flex-col gap-2">
			<div className="grid grid-cols-2 gap-4 p-10">
				<AdvancementModal />
				<RewardModal />
				<RetireCharacterModal />
				<AscendTheThroneModal />
				<AdjustmentModal />
			</div>
			<Extras character={character} />
		</div>
	);
}
