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
		rewards: mystery.rewards,
	};
}

export function findSupplicant(key: string): string | undefined {
	const allSupplicants = Object.values(canonicalMysteries)
		.flat()
		.flatMap((m) => {
			return Object.keys(m.rewards.supplicants).map((s) => ({
				key: s,
				value: m.rewards.supplicants[s],
			}));
		});
	const supplicant = allSupplicants.find((s) => s.key === key);
	if (!supplicant) {
		return undefined;
	}
	return supplicant.value;
}
