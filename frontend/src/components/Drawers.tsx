import { useState } from "react";
import { DominionSheet } from "./dominion/DominionSheet";
import { JourneySheet } from "./journeys/JourneySheet";
import { TowerSheet } from "./mourningTower/towerSheet";
import { MysterySheet } from "./mystery/MysterySheet";
import { NotesPane } from "./notes/NotesPane";
import { PullOutCharacterOverview } from "./playbooks/drawer/PullOutDrawer";
import { ReferenceSheet } from "./referenceSheet/referenceSheet";
import { SafetyPane } from "./safety/SafetySheet";
import { SettingsPane } from "./settings/SettingsPane";

export function Drawers() {
	const [refOpen, setRefOpen] = useState(false);
	const [pullOutOpen, setPullOutOpen] = useState(false);
	const [mysteryOpen, setMysteryOpen] = useState(false);
	const [journeysOpen, setJourneysOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [notesOpen, setNotesOpen] = useState(false);
	const [towerOpen, setTowerOpen] = useState(false);
	const [dominionOpen, setDominionOpen] = useState(false);
	const [safetyOpen, setSafetyOpen] = useState(false);
	return (
		<nav className="absolute top-0 left-0 w-full h-auto flex flex-col justify-start items-start pointer-events-none">
			<ReferenceSheet isOpen={refOpen} setIsOpen={setRefOpen} />
			<MysterySheet isOpen={mysteryOpen} setIsOpen={setMysteryOpen} />
			<DominionSheet isOpen={dominionOpen} setIsOpen={setDominionOpen} />
			<PullOutCharacterOverview
				isOpen={pullOutOpen}
				setIsOpen={setPullOutOpen}
			/>
			<JourneySheet isOpen={journeysOpen} setIsOpen={setJourneysOpen} />
			<TowerSheet isOpen={towerOpen} setIsOpen={setTowerOpen} />
			<NotesPane isOpen={notesOpen} setIsOpen={setNotesOpen} />
			<SafetyPane isOpen={safetyOpen} setIsOpen={setSafetyOpen} />
			<SettingsPane isOpen={settingsOpen} setIsOpen={setSettingsOpen} />
		</nav>
	);
}
