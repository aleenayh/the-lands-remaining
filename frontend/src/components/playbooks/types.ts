export type PlaybookBase = {
	title: string;
	intro: string[];
	names: string[];
	honorifics: string[];
	look: string[];
	rituals: string[];
	questions: string[];
	abilities: Stats;
	cinders: Record<number, string>;
	relics: {
		title: string;
		text: string;
		extraLines: number;
	}[];
	oldFire: string[];
	fireToCome: {
		[key: string]: string;
	};
	ascendTheThrone: string[];
	moves: PlaybookMove[];
};

export type Stats = {
	vitality: number;
	composure: number;
	reason: number;
	presence: number;
	cinder: number;
};

export type PlaybookMove = {
	title: string;
	text: string[];
	checkboxes?: boolean[];
	extraLines?: number;
};

export type CoreMoveState =
	| { type: "nameless"; legion: boolean[] }
	| { type: "candle-bearer" }
	| { type: "lock-and-key"; checks: boolean[] };

export type Character = {
	playbook: playbookKey;
	playerId: string;
	name: string;
	look: string;
	ritual: string;
	oldFire: number;
	fireToCome: number;
	conditions: string[];
	moves: {
		title: string;
		checks: boolean[];
		lines: string[];
	}[];
	coreMoveState: CoreMoveState;
	advancements: Record<number, boolean>;
	abilities: Stats;
	cinders: Record<number, boolean>;
	relics: {
		title: string;
		text: string;
		extraLines: number;
	}[];
	/** Tracks which relic aspects are checked. Array of 0|1 values in order of appearance. */
	relicAspects: number[];
	experience: number;
	questions: Record<number, boolean>;
};

export const playbookKeys = {
	candleBearer: "candle-bearer",
	nameless: "nameless",
	lockAndKey: "lock-and-key",
} as const;

export type playbookKey = (typeof playbookKeys)[keyof typeof playbookKeys];
