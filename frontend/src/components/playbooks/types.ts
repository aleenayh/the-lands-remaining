import { z } from "zod";

export const abilitiesSchema = z.object({
	vitality: z.number(),
	composure: z.number(),
	reason: z.number(),
	presence: z.number(),
	cinder: z.number(),
});

export type Abilities = z.infer<typeof abilitiesSchema>;

export const fireToComeKeys = {
	"The Kindling Gate": "The Kindling Gate",
	"The Tinder Arch": "The Tinder Arch",
	"The Hearth's Fuel": "The Hearth's Fuel",
	"The Ashen Passage": "The Ashen Passage",
	"The Pyre's Crown": "The Pyre's Crown",
} as const;

const fireToComeKeysTuple = [
	"The Kindling Gate",
	"The Tinder Arch",
	"The Hearth's Fuel",
	"The Ashen Passage",
	"The Pyre's Crown",
] as const;

export type fireToComeKey =
	(typeof fireToComeKeys)[keyof typeof fireToComeKeys];

export const playbookBaseSchema = z.object({
	title: z.string(),
	intro: z.array(z.string()),
	names: z.array(z.string()),
	honorifics: z.array(z.string()),
	look: z.array(z.string()),
	rituals: z.array(z.string()),
	questions: z.array(z.string()),
	abilities: abilitiesSchema,
	cinders: z.record(z.number(), z.string()),
	relics: z.array(
		z.object({
			title: z.string(),
			text: z.string(),
			extraLines: z.number(),
		}),
	),
	oldFire: z.array(z.string()),
	fireToCome: z.record(z.enum(fireToComeKeysTuple), z.string()),
	ascendTheThrone: z.array(z.string()),
	moves: z.array(
		z.object({
			title: z.string(),
			text: z.array(z.string()),
			checkboxes: z.number().optional(),
			extraLines: z.number().optional(),
		}),
	),
});

export type PlaybookBase = z.infer<typeof playbookBaseSchema>;

export type PlaybookMove = {
	title: string;
	text: string[];
	checkboxes?: number;
	extraLines?: number;
};

export const candleSchema = z.object({
	checks: z.number(),
	aspect: z.string(),
	complication: z.string().optional(),
});

export type Candle = z.infer<typeof candleSchema>;

export const coreMoveStateSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("nameless"),
		legion: z.array(z.boolean()),
	}),
	z.object({
		type: z.literal("crowns-pearl"),
		checks: z.number(),
		whatStole: z.string(),
		resolved: z.boolean(),
	}),
	z.object({
		type: z.literal("candle-bearer"),
		wax: z.number(),
		complications: z.array(z.string()),
		candles: z.record(
			z.string(),
			z.object({
				checks: z.number(),
				aspect: z.string(),
				complication: z.string().optional(),
			}),
		),
	}),
	z.object({
		type: z.literal("lock-and-key"),
		checks: z.array(z.number()),
	}),
	z.object({
		type: z.literal("famisher"),
		checks: z.number(),
	}),
	z.object({
		type: z.literal("crux-druid"),
		sapling: z.object({
			roots: z.string(),
			trunk: z.string(),
			bark: z.string(),
			sap: z.string(),
			branches: z.string(),
			leaves: z.string(),
			connection: z.string(),
		}),
		bodyParts: z.array(z.string()),
		checks: z.number(),
	}),
]);

export type CoreMoveState = z.infer<typeof coreMoveStateSchema>;

export const playbookKeys = {
	candleBearer: "candle-bearer",
	nameless: "nameless",
	lockAndKey: "lock-and-key",
	crownsPearl: "crowns-pearl",
	famisher: "famisher",
	cruxDruid: "crux-druid",
} as const;

const playbookKeysTuple = [
	"candle-bearer",
	"nameless",
	"lock-and-key",
	"crowns-pearl",
	"famisher",
	"crux-druid",
] as const;

export type playbookKey = (typeof playbookKeys)[keyof typeof playbookKeys];

const fireToComeDefault: Record<fireToComeKey, boolean> = {
	"The Kindling Gate": false,
	"The Tinder Arch": false,
	"The Hearth's Fuel": false,
	"The Ashen Passage": false,
	"The Pyre's Crown": false,
};

const defaultAbilities: Abilities = {
	vitality: 0,
	composure: 0,
	reason: 0,
	presence: 0,
	cinder: -2,
};
export const characterSchema = z.object({
	playbook: z.enum(playbookKeysTuple),
	playerId: z.string(),
	name: z.string(),
	look: z.string().catch(""),
	ritual: z.string().catch(""),
	oldFire: z.number().catch(0),
	fireToCome: z
		.record(z.enum(fireToComeKeysTuple), z.boolean())
		.catch(fireToComeDefault),
	conditions: z.array(z.string()).catch(["", "", ""]),
	moves: z
		.array(
			z.object({
				title: z.string(),
				text: z.array(z.string()).optional(), //only necessary for custom moves
				checks: z.array(z.number()).optional(),
				lines: z.array(z.string()).optional(),
			}),
		)
		.catch([]),
	coreMoveState: coreMoveStateSchema,
	advancements: z.record(z.string(), z.boolean()).catch({
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false,
		7: false,
		8: false,
		9: false,
	}),
	abilities: abilitiesSchema.catch(defaultAbilities),
	cinders: z
		.record(z.string(), z.boolean())
		.catch({ 1: false, 2: false, 3: false, 4: false, 5: false }),
	relics: z
		.array(
			z.object({
				title: z.string(),
				text: z.string(),
				extraLines: z.number(),
			}),
		)
		.catch([]),
	/** Tracks which relic aspects are checked. Array of 0|1 values in order of appearance. */
	relicAspects: z.array(z.number()).catch([0]),
	experience: z.number().catch(0),
	questions: z
		.record(z.string(), z.boolean())
		.catch({ 1: false, 2: false, 3: false, 4: false, 5: false }),
});

export type Character = z.infer<typeof characterSchema>;
