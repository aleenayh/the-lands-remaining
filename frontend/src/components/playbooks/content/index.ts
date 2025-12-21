import { type PlaybookBase, playbookKeys } from "../types";
import { CandleBearer } from "./candle-bearer";
import { CrownsPearl } from "./crowns-pearl";
import { CruxDruid } from "./crux-druid";
import { LockAndKey } from "./lock-and-key";
import { LoneFamisher } from "./lone-famisher";
import { Nameless } from "./nameless";

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
};

export const advancements: Record<number, string> = {
	1: "Increase an ability by 1 (max 3)",
	2: "Increase an ability by 1 (max 3)",
	3: "Increase an ability by 1 (max 3)",
	4: "Increase Cinder by 1 (max 3)",
	5: "Choose an additional move from your playbook",
	6: "Choose an additional move from your playbook",
	7: "Write a custom move for your character",
	8: "Unmark all Aspects",
	9: "Unmark all Aspects",
};
