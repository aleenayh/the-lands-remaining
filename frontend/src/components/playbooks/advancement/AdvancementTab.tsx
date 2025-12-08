import { AdvancementModal } from "./AdvancementModal";
import { AscendTheThroneModal } from "./AscendModal";
import { RetireCharacterModal } from "./RetireModal";
import { RewardModal } from "./RewardModal";

export function AdvancementTab() {
	return (
		<div className="grid grid-cols-2 gap-4 p-10">
			<AdvancementModal />
			<RewardModal />
			<RetireCharacterModal />
			<AscendTheThroneModal />
		</div>
	);
}
