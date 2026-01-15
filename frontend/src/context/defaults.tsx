import { defaultAnchoresses } from "../components/mourningTower/types";
import { getLocalSchemaVersion } from "../utils/versionCheck";
import type { GameState } from "./types";

export const defaultGameState: GameState = {
	gameHash: "",
	mysteries: [],
	dominion: null,
	journeys: [],
	tower: {
		supplicants: [],
		anchoresses: defaultAnchoresses,
	},
	players: [],
	timestamp: new Date(),
	safety: {
		lines: [],
		veils: [],
	},
	schemaVersion: getLocalSchemaVersion(),
};
