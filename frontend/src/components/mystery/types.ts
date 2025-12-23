import { z } from "zod";

export const questionSchema = z.object({
	text: z.string(),
	complexity: z.coerce.number(),
});

export type Question = z.infer<typeof questionSchema>;

export enum MysteryTheme {
	Dandelion = "dandelion",
	Rose = "rose",
	Sword = "sword",
	Swallow = "swallow",
}

export const mysterySchema = z.object({
	title: z.string().catch("Mystery"),
	questions: z.array(questionSchema).catch([]),
	theme: z.nativeEnum(MysteryTheme).catch(MysteryTheme.Dandelion),
	countdownTotal: z.coerce.number().catch(3),
	countdownCurrent: z.coerce.number().catch(0),
});

export type Mystery = z.infer<typeof mysterySchema>;
