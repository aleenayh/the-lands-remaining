import type { Character } from "../types";
import { type CoreMoveState, type playbookKey, playbookKeys } from "../types";
import { CoreMoveCandleBearer } from "./CandleBearer";
import { CoreMoveCrownsPearl } from "./CrownsPearl";
import { CoreMoveCruxDruid } from "./CruxDruid";
import { CoreMoveLockAndKey } from "./LockAndKey";
import { CoreMoveLoneFamisher } from "./LoneFamisher";
import { CoreMoveNameless, legionNames } from "./Nameless";

export const coreMoves: (
	character: Character,
) => Record<playbookKey, React.ReactNode> = (character: Character) => {
	return {
		[playbookKeys.candleBearer]: CoreMoveCandleBearer({ character }),
		[playbookKeys.nameless]: CoreMoveNameless({ character }),
		[playbookKeys.lockAndKey]: CoreMoveLockAndKey({ character }),
		[playbookKeys.crownsPearl]: CoreMoveCrownsPearl({ character }),
		[playbookKeys.famisher]: CoreMoveLoneFamisher({ character }),
		[playbookKeys.cruxDruid]: CoreMoveCruxDruid({ character }),
	};
};

export const coreMoveTitles: Record<playbookKey, string> = {
	[playbookKeys.candleBearer]: "The Waxen Order Keeps the Flame…",
	[playbookKeys.nameless]: "The Nameless Legion Endures…",
	[playbookKeys.lockAndKey]: "The Mouse in the Tower…",
	[playbookKeys.crownsPearl]: "My Word, My Vow…",
	[playbookKeys.famisher]: "There is no god greater than Hunger…",
	[playbookKeys.cruxDruid]:
		"Do Not Let Me Hang Alone & Plant Me Where My Power Can Grow",
};

export function generateCoreMoveState(playbookKey: playbookKey): CoreMoveState {
	switch (playbookKey) {
		case playbookKeys.nameless: {
			const legion: boolean[] = Array.from(
				{ length: legionNames.length },
				() => false,
			);
			return { type: "nameless", legion };
		}
		case playbookKeys.candleBearer:
			return {
				type: "candle-bearer",
				wax: 0,
				complications: ["The candle draws unwanted attention.", "", "", "", ""],
				candles: Object.fromEntries(
					Array.from({ length: 6 }, (_, index) => [
						index,
						{
							checks: 0,
							aspect: "",
							complication: "",
						},
					]),
				),
			};
		case playbookKeys.lockAndKey:
			return {
				type: "lock-and-key",
				checks: Array.from({ length: 12 }, () => 0),
			};
		case playbookKeys.crownsPearl:
			return {
				type: "crowns-pearl",
				whatStole: "",
				checks: 0,
				resolved: false,
			};
		case playbookKeys.famisher:
			return {
				type: "famisher",
				checks: 0,
			};
		case playbookKeys.cruxDruid:
			return {
				type: "crux-druid",
				sapling: {
					roots: "",
					trunk: "",
					bark: "",
					sap: "",
					branches: "",
					leaves: "",
					connection: "",
				},
				bodyParts: Array.from({ length: 6 }, () => ""),
				checks: 0,
			};
	}
}
