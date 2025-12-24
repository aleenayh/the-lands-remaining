import { z } from "zod";
import { mysterySchema } from "../components/mystery/types";
import { characterSchema } from "../components/playbooks/types";
import { catchWithWarning } from "../utils/schemaValidation";

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
	online: z.boolean().catch(catchWithWarning("player.online", false)),
	role: z
		.enum([PlayerRole.KEEPER, PlayerRole.PLAYER])
		.catch(catchWithWarning("player.role", PlayerRole.PLAYER)),
	//no warning - null character is valid but dropped by firebase
	character: characterSchema.nullable().catch(null),
});

export const gameStateSchema = z.object({
	gameHash: z.string().catch(catchWithWarning("gameHash", "")),
	//no catchWithWarning for mysteries - empty array is valid, but dropped by firebase
	mysteries: z.array(mysterySchema).catch([]),
	players: z.array(playerSchema).catch(catchWithWarning("players", [])),
	timestamp: z.coerce.date().catch(catchWithWarning("timestamp", new Date())),
});

export type GameState = z.infer<typeof gameStateSchema>;

export type UserInfo = z.infer<typeof userInfoSchema>;
