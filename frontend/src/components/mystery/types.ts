import { z } from "zod";
import { catchWithWarning } from "../../utils/schemaValidation";

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
	title: z.string().catch(catchWithWarning("mystery.title", "Mystery")),
	questions: z
		.array(questionSchema)
		.optional()
		.catch(catchWithWarning("mystery.questions", [])),
	theme: z
		.nativeEnum(MysteryTheme)
		.catch(catchWithWarning("mystery.theme", MysteryTheme.Dandelion)),
	countdownTotal: z.coerce
		.number()
		.catch(catchWithWarning("mystery.countdownTotal", 3)),
	countdownCurrent: z.coerce
		.number()
		.catch(catchWithWarning("mystery.countdownCurrent", 0)),
});

export type Mystery = z.infer<typeof mysterySchema>;
