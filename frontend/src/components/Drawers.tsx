import { useState } from "react";
import { PullOutCharacterOverview } from "./playbooks/drawer/PullOutDrawer";
import { ReferenceSheet } from "./referenceSheet/referenceSheet";

export function Drawers() {
	const [refOpen, setRefOpen] = useState(false);
	const [pullOutOpen, setPullOutOpen] = useState(false);

	return (
		<div className="absolute top-0 left-0 w-full h-auto flex flex-col justify-start items-start">
			<ReferenceSheet isOpen={refOpen} setIsOpen={setRefOpen} />
			<PullOutCharacterOverview
				isOpen={pullOutOpen}
				setIsOpen={setPullOutOpen}
			/>
		</div>
	);
}
