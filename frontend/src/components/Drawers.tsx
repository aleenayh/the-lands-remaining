import { useState } from "react";
import { ReactComponent as Logo } from "./assets/tlr-logo.svg";
import { DominionSheet } from "./dominion/DominionSheet";
import { ReactComponent as FootprintsIcon } from "./journeys/footprints.svg";
import { JourneySheet } from "./journeys/JourneySheet";
import { ReactComponent as TowerIcon } from "./mourningTower/tower.svg";
import { TowerSheet } from "./mourningTower/towerSheet";
import { ReactComponent as HourglassIcon } from "./mystery/hourglass.svg";
import { MysterySheet } from "./mystery/MysterySheet";
import { NotesPane } from "./notes/NotesPane";
import { ReactComponent as NotesIcon } from "./notes/quill.svg";
import { ReactComponent as PlayersIcon } from "./playbooks/drawer/group.svg";
import { PullOutCharacterOverview } from "./playbooks/drawer/PullOutDrawer";
import { ReactComponent as BookIcon } from "./referenceSheet/book.svg";
import { ReferenceSheet } from "./referenceSheet/referenceSheet";
import { ReactComponent as HeartShieldIcon } from "./safety/heartshield.svg";
import { SafetyPane } from "./safety/SafetySheet";
import { ReactComponent as CogIcon } from "./settings/cog.svg";
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
		<div className="hidden md:flex absolute top-0 left-0 w-full h-auto flex-col justify-start items-start pointer-events-none">
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
		</div>
	);
}

const tabKeys = [
	"reference",
	"notes",
	"journeys",
	"mystery",
	"home",
	"players",
	"tower",
	"safety",
	"settings",
];
const icons: Record<(typeof tabKeys)[number], React.ReactNode> = {
	reference: <BookIcon className="w-full h-full" />,
	mystery: <HourglassIcon className="w-full h-full" />,
	journeys: <FootprintsIcon className="w-full h-full" />,
	players: <PlayersIcon className="w-full h-full" />,
	home: <Logo className="w-full h-full" />,
	notes: <NotesIcon className="w-full h-full" />,
	tower: <TowerIcon className="w-full h-full" />,
	safety: <HeartShieldIcon className="w-full h-full" />,
	settings: <CogIcon className="w-full h-full" />,
};

export function MobileDrawerNavigation() {
	const [refOpen, setRefOpen] = useState(false);
	const [playersOpen, setPlayersOpen] = useState(false);
	const [mysteryOpen, setMysteryOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [notesOpen, setNotesOpen] = useState(false);
	const [towerOpen, setTowerOpen] = useState(false);
	const [journeysOpen, setJourneysOpen] = useState(false);
	const [safetyOpen, setSafetyOpen] = useState(false);

	const closeAllExcept = (key: (typeof tabKeys)[number] | null) => {
		setRefOpen(false);
		setMysteryOpen(false);
		setPlayersOpen(false);
		setNotesOpen(false);
		setJourneysOpen(false);
		setSafetyOpen(false);
		setSettingsOpen(false);
		setTowerOpen(false);
		switch (key) {
			case "reference":
				setRefOpen(true);
				break;
			case "mystery":
				setMysteryOpen(true);
				break;
			case "players":
				setPlayersOpen(true);
				break;
			case "notes":
				setNotesOpen(true);
				break;
			case "safety":
				setSafetyOpen(true);
				break;
			case "journeys":
				setJourneysOpen(true);
				break;
			case "settings":
				setSettingsOpen(true);
				break;
			case "tower":
				setTowerOpen(true);
				break;
			default:
				break;
		}
	};

	return (
		<div className="flex md:hidden">
			<div className="flex absolute top-0 left-0 w-full h-full flex-col justify-start items-start pointer-events-none pb-16">
				<ReferenceSheet isOpen={refOpen} setIsOpen={setRefOpen} />
				<MysterySheet isOpen={mysteryOpen} setIsOpen={setMysteryOpen} />
				<JourneySheet isOpen={journeysOpen} setIsOpen={setJourneysOpen} />
				<PullOutCharacterOverview
					isOpen={playersOpen}
					setIsOpen={setPlayersOpen}
				/>
				<TowerSheet isOpen={towerOpen} setIsOpen={setTowerOpen} />
				<NotesPane isOpen={notesOpen} setIsOpen={setNotesOpen} />
				<SafetyPane isOpen={safetyOpen} setIsOpen={setSafetyOpen} />
				<SettingsPane isOpen={settingsOpen} setIsOpen={setSettingsOpen} />
			</div>
			<div className="absolute bottom-0 left-0 mx-0 w-full h-auto flex justify-stretch items-center whitespace-nowrap isolate z-10">
				{tabKeys.map((tab) => (
					<button
						type="button"
						className={`mobileNavButton ${tab === "home" ? "flex-1 scale-125 z-[15] bg-theme-bg-accent" : "scale-100 z-10"}`}
						onClick={() => closeAllExcept(tab)}
						key={tab}
					>
						{icons[tab]}
					</button>
				))}
			</div>
		</div>
	);
}
