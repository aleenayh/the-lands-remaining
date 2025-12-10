import type { Mystery } from "../components/mystery/types";
import type { Character } from "../components/playbooks/types";
import type { ShrineType } from "../components/shrine/details";

export type UserInfo = {
	id: string;
	name: string;
	role: PlayerRole;
};

export type GameState = {
	gameHash: string;
	land: Land;
	mysteries: Mystery[];
	shrines: Shrine[];
	players: Player[];
	messages: string[];
};

type Land = "forest" | "elegy";

export type Shrine = {
	id: ShrineType;
	state: ShrineState;
	color: string | null;
};
export type ShrineState = "available" | "active" | "completed" | "locked";

type Player = {
	id: string;
	name: string;
	online: boolean;
	role: PlayerRole;
	character: Character | null;
};

export enum PlayerRole {
	KEEPER = "keeper",
	PLAYER = "player",
}
