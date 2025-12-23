import { z } from "zod";
import { mysterySchema } from "../components/mystery/types";
import { characterSchema } from "../components/playbooks/types";

export enum PlayerRole {
	KEEPER = "keeper",
	PLAYER = "player",
}

export const userInfoSchema = z.object({
	id: z.string(),
	name: z.string(),
	role: z.enum([PlayerRole.KEEPER, PlayerRole.PLAYER]),
});

const playerSchema = z.object({
	id: z.string(),
	name: z.string(),
	online: z.boolean().catch(false),
	role: z.enum([PlayerRole.KEEPER, PlayerRole.PLAYER]).catch(PlayerRole.PLAYER),
	character: characterSchema.nullable().catch(null),
});

export const gameStateSchema = z.object({
	gameHash: z.string().catch(""),
	mysteries: z.array(mysterySchema).catch([]),
	players: z.array(playerSchema).catch([]),
	timestamp: z.number().catch(0),
});

export type GameState = z.infer<typeof gameStateSchema>;

export type UserInfo = z.infer<typeof userInfoSchema>;
