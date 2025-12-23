import type { Mystery } from "../components/mystery/types";
import type { Character } from "../components/playbooks/types";

export type UserInfo = {
	id: string;
	name: string;
	role: PlayerRole;
};

export type GameState = {
	gameHash: string;
	mysteries: Mystery[];
	players: Player[];
	messages: string[];
};

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
