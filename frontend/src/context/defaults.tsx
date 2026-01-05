import { getLocalSchemaVersion } from "../utils/versionCheck";
import type { GameState } from "./types";

export const defaultGameState: GameState = {
	gameHash: "",
	mysteries: [],
	dominion: null,
	players: [],
	timestamp: new Date(),
	safety: {
		lines: [],
		veils: [],
	},
	schemaVersion: getLocalSchemaVersion(),
};
