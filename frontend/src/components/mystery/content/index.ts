import type { AvailableLands, MysteryContent } from "../types";
import { ElegyMysteries } from "./elegy";
import { GreatForestMysteries } from "./greatForest";
import { NevaskMysteries } from "./nevask";
import { SagravelleMysteries } from "./sagravelle";

export const canonicalMysteries: Record<
	keyof typeof AvailableLands,
	MysteryContent[]
> = {
	elegy: ElegyMysteries,
	greatForest: GreatForestMysteries,
	sagravelle: SagravelleMysteries,
	nevask: NevaskMysteries,
};

export function lookupMystery(title: string): MysteryContent | undefined {
	const allMysteries = Object.values(canonicalMysteries).flat();
	const mystery = allMysteries.find((m) => m.title === title);
	if (!mystery) {
		return undefined;
	}
	return {
		title: mystery.title,
		questionsAndOpportunities: mystery.questionsAndOpportunities,
		intro: mystery.intro,
		countdownTotal: mystery.countdownTotal,
		clues: mystery.clues,
	};
}
