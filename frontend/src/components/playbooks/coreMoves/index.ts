import type { Character } from "../types";
import { type CoreMoveState, type playbookKey, playbookKeys } from "../types";
import { CoreMoveCandleBearer } from "./CandleBearer";
import { CoreMoveLockAndKey } from "./LockAndKey";
import { CoreMoveNameless, legionNames } from "./Nameless";

export const coreMoves: (
	character: Character,
) => Record<playbookKey, React.ReactNode> = (character: Character) => {
	return {
		[playbookKeys.candleBearer]: CoreMoveCandleBearer({ character }),
		[playbookKeys.nameless]: CoreMoveNameless({ character }),
		[playbookKeys.lockAndKey]: CoreMoveLockAndKey({ character }),
	};
};

export const coreMoveTitles: Record<playbookKey, string> = {
	[playbookKeys.candleBearer]: "The Waxen Order Keeps the Flame…",
	[playbookKeys.nameless]: "The Nameless Legion Endures…",
	[playbookKeys.lockAndKey]: "The Mouse in the Tower…",
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
			return { type: "candle-bearer" };
		case playbookKeys.lockAndKey:
			return {
				type: "lock-and-key",
				checks: Array.from({ length: 12 }, () => 0),
			};
	}
}
