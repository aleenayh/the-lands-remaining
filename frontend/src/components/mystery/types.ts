import { z } from "zod";
import { catchWithWarning } from "../../utils/schemaValidation";

export const questionSchema = z.object({
	text: z.string(),
	opportunity: z.string().optional().catch(undefined),
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
	removed: z.boolean().catch(false),
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

export const dominionSchema = z.object({
	title: z.string().catch(catchWithWarning("dominion.title", "Dominion")),
	questions: z
		.array(questionSchema)
		.optional()
		.catch(catchWithWarning("dominion.questions", [])),
	clues: z
		.array(clueSchema)
		.optional()
		.catch(catchWithWarning("dominion.clues", [])),
});

export type Dominion = z.infer<typeof dominionSchema>;

type MysteryBase = {
	title: string;
	questionsAndOpportunities: {
		question: string;
		complexity: number;
		opportunity: string;
	}[];
	intro: string[];
	clues: string[];
};

export type MysteryContent = MysteryBase & {
	countdownTotal: number;
	rewards: {
		supplicants: Record<string, string>;
		items: string[];
		special?: { condition: string; rewards: string[] }[];
	};
};

type Servant = {
	title: string;
	description: string[];
	quotes: string[];
};
type Layer = {
	title: string;
	text: string[];
};

export type DominionContent = MysteryBase & {
	servants: Servant[];
	layers: Layer[];
};

export const AvailableLands = {
	elegy: "Elegy",
	greatForest: "The Great Forest",
	sagravelle: "Sagravelle",
	nevask: "Nevask",
} as const;
