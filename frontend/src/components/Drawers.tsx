import { useState } from "react";
import { MysterySheet } from "./mystery/MysterySheet";
import { PullOutCharacterOverview } from "./playbooks/drawer/PullOutDrawer";
import { ReferenceSheet } from "./referenceSheet/referenceSheet";
import { SettingsPane } from "./settings/SettingsPane";

export function Drawers() {
	const [refOpen, setRefOpen] = useState(false);
	const [pullOutOpen, setPullOutOpen] = useState(false);
	const [mysteryOpen, setMysteryOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	return (
		<nav className="absolute top-0 left-0 w-auto h-auto flex flex-col justify-start items-start">
			<ReferenceSheet isOpen={refOpen} setIsOpen={setRefOpen} />
			<MysterySheet isOpen={mysteryOpen} setIsOpen={setMysteryOpen} />
			<PullOutCharacterOverview
				isOpen={pullOutOpen}
				setIsOpen={setPullOutOpen}
			/>
			<SettingsPane isOpen={settingsOpen} setIsOpen={setSettingsOpen} />
		</nav>
	);
}
