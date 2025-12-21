export type PlaybookBase = {
	title: string;
	intro: string[];
	names: string[];
	honorifics: string[];
	look: string[];
	rituals: string[];
	questions: string[];
	abilities: Abilities;
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

export type Abilities = {
	vitality: number;
	composure: number;
	reason: number;
	presence: number;
	cinder: number;
};

export type PlaybookMove = {
	title: string;
	text: string[];
	checkboxes?: number;
	extraLines?: number;
};

type Candle = {
	checks: number;
	aspect: string;
	complication?: string;
};

export type CoreMoveState =
	| { type: "nameless"; legion: boolean[] }
	| {
			type: "crowns-pearl";
			checks: number;
			whatStole: string;
			resolved: boolean;
	  }
	| {
			type: "candle-bearer";
			wax: number;
			complications: string[];
			candles: Record<number, Candle>;
	  }
	| { type: "lock-and-key"; checks: number[] }
	| { type: "famisher"; checks: number }
	| {
			type: "crux-druid";
			sapling: {
				roots: string;
				trunk: string;
				bark: string;
				sap: string;
				branches: string;
				leaves: string;
				connection: string;
			};
			bodyParts: string[];
			checks: number;
	  };

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
		text?: string[]; //only necessary for custom moves
		checks?: number[];
		lines?: string[];
	}[];
	coreMoveState: CoreMoveState;
	advancements: Record<number, boolean>;
	abilities: Abilities;
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
	crownsPearl: "crowns-pearl",
	famisher: "famisher",
	cruxDruid: "crux-druid",
} as const;

export type playbookKey = (typeof playbookKeys)[keyof typeof playbookKeys];
