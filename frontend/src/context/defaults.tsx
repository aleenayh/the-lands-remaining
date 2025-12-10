import type { Mystery } from "../components/mystery/types";
import type { GameState, Shrine } from "./types";

const defaultMysteries: Mystery[] = [];

const defaultShrines: Shrine[] = [];

export const defaultGameState: GameState = {
	gameHash: "",
	land: "elegy",
	shrines: defaultShrines,
	mysteries: defaultMysteries,
	players: [],
	messages: [],
};
