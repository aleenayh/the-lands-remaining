import { z } from "zod";
import { catchWithWarning } from "../../utils/schemaValidation";

export const questionSchema = z.object({
	text: z.string(),
	opportunity: z
		.string()
		.catch(catchWithWarning("mystery.question.opportunity", "")),
	complexity: z.coerce
		.number()
		.catch(catchWithWarning("mystery.question.coplexity", 2)),
});

export type Question = z.infer<typeof questionSchema>;

export enum MysteryTheme {
	Dandelion = "dandelion",
	Rose = "rose",
	Sword = "sword",
	Swallow = "swallow",
}

const clueSchema = z.object({
	text: z.string().catch(catchWithWarning("mystery.clue.text", "")),
	earned: z.boolean().catch(false),
	explained: z.boolean().catch(false),
});

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
	clues: z.array(clueSchema).optional().catch([]),
});

export type Mystery = z.infer<typeof mysterySchema>;

export type MysteryContent = {
	title: string;
	questionsAndOpportunities: {
		question: string;
		complexity: number;
		opportunity: string;
	}[];
	intro: string[];
	countdownTotal: number;
	clues: string[];
};

export const AvailableLands = {
	elegy: "Elegy",
	greatForest: "The Great Forest",
	sagravelle: "Sagravelle",
	nevask: "Nevask",
} as const;
