import type {
	Character,
	CustomTextFields,
	fireToComeKey,
	PlaybookBase,
} from "../types";
import { fireToComeKeys, playbookKeys } from "../types";
import { CandleBearer } from "./candle-bearer";
import { CrownsPearl } from "./crowns-pearl";
import { CruxDruid } from "./crux-druid";
import { HowlingTroubadour } from "./howling-troubadour";
import { LockAndKey } from "./lock-and-key";
import { LoneFamisher } from "./lone-famisher";
import { Nameless } from "./nameless";

// const blankPlaybook: PlaybookBase = {
// 	title: "Community-Created Ember",
// 	intro: [],
// 	names: [],
// 	honorifics: [],
// 	look: [],
// 	rituals: [],
// 	questions: [],
// 	abilities: {
// 		vitality: 0,
// 		composure: 0,
// 		reason: 0,
// 		presence: 0,
// 		cinder: -2,
// 	},
// 	cinders: {},
// 	relics: [],
// 	oldFire: [],
// 	fireToCome: {
// 		"The Kindling Gate": "",
// 		"The Tinder Arch": "",
// 		"The Hearth's Fuel": "",
// 		"The Ashen Passage": "",
// 		"The Pyre's Crown": "",
// 	},
// 	ascendTheThrone: [],
// 	moves: [],
// };

export const playbookBases: Record<
	(typeof playbookKeys)[keyof typeof playbookKeys],
	PlaybookBase
> = {
	[playbookKeys.candleBearer]: CandleBearer,
	[playbookKeys.nameless]: Nameless,
	[playbookKeys.lockAndKey]: LockAndKey,
	[playbookKeys.crownsPearl]: CrownsPearl,
	[playbookKeys.famisher]: LoneFamisher,
	[playbookKeys.cruxDruid]: CruxDruid,
	[playbookKeys.howlingTroubadour]: HowlingTroubadour,
};

export const advancements: Record<number, string> = {
	1: "Increase an ability by 1 (max 3)",
	2: "Increase an ability by 1 (max 3)",
	3: "Increase an ability by 1 (max 3)",
	4: "Increase Cinder by 1 (max 3)",
	5: "Choose an additional Ember move",
	6: "Choose an additional Ember move",
	7: "Write a custom move for your character",
	8: "Unmark all Aspects",
	9: "Unmark all Aspects",
};

export function customFieldOrFallback(
	character: Character,
	key: keyof CustomTextFields,
): {
	key: keyof CustomTextFields;
	value: string[] | Record<fireToComeKey, string> | Record<number, string>;
} {
	const rawText = character.customTextFields?.[key];

	if (!rawText) {
		return { key: key, value: [""] };
	}

	switch (key) {
		case "fireToCome": {
			//record <fireToComeKey, string>
			const strippedOfKeys = rawText.map((text) => text.split(":")[1].trim());
			const record = Object.fromEntries(
				strippedOfKeys.map((text, index) => [
					Object.keys(fireToComeKeys)[index],
					text,
				]),
			);
			return {
				key: "fireToCome",
				value: record as Record<fireToComeKey, string>,
			};
		}
		case "oldFire":
			//string[]
			return { key: "oldFire", value: rawText as string[] };
		case "questionDefinitions":
			//string[]
			return { key: "questionDefinitions", value: rawText as string[] };
		case "cinderDefinitions": {
			//record <number, string>
			const record = Object.fromEntries(
				rawText.map((text, index) => [index, text]),
			);

			return {
				key: "cinderDefinitions",
				value: record as Record<number, string>,
			};
		}
	}
}
