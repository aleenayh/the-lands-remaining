import { z } from "zod";

export const journeySchema = z.object({
	name: z.string().catch("Journey"),
	checks: z.array(z.number()).catch([0, 0, 0, 0]),
	extra: z.string().catch(""),
});

export type Journey = z.infer<typeof journeySchema>;
