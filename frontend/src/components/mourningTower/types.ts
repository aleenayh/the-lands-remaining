import { z } from "zod";

export type AnchoressContent = {
	name: string;
	prayer: {
		intro: string;
		prompts: string[];
	};
	quest: {
		description: string;
		checkboxes: number;
	};
	fires: string[];
};

export const anchoressSchema = z.object({
	state: z.enum(["available", "prayer", "quest", "fires"]),
	quest: z.array(z.number()).catch([0, 0, 0]),
	fires: z.array(z.number()).catch([0, 0, 0, 0, 0]),
});

export type Anchoress = z.infer<typeof anchoressSchema>;

export const defaultAnchoresses: Record<string, Anchoress> = {
	shereen: {
		state: "available",
		quest: [0, 0, 0],
		fires: [0, 0, 0, 0, 0],
	},
	tarryn: {
		state: "available",
		quest: [0, 0, 0],
		fires: [0, 0, 0, 0, 0],
	},
	alecta: {
		state: "available",
		quest: [0, 0, 0],
		fires: [0, 0, 0, 0, 0],
	},
	gloria: {
		state: "available",
		quest: [0, 0, 0],
		fires: [0, 0, 0, 0, 0],
	},
	beryth: {
		state: "available",
		quest: [0, 0, 0],
		fires: [0, 0, 0, 0, 0],
	},
};
