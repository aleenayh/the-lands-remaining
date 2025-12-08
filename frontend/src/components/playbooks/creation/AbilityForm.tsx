import type { FieldValues, UseFormRegister } from "react-hook-form";
import type { Stats as StatsType } from "../types";
import { StatBox } from "../sharedComponents/Stats";

type StatFieldName =
	| "vitality"
	| "composure"
	| "reason"
	| "presence"
	| "cinder";

type StatsProps = {
	stats: StatsType;
	editable: boolean;
	registerStat?: (
		name: StatFieldName,
	) => ReturnType<UseFormRegister<FieldValues>>;
};

export function AbilityForm({ stats, editable, registerStat }: StatsProps) {
	return (
		<div
			className={`flex flex-wrap justify-center ${editable ? "gap-2" : "gap-1"}`}
		>
			{(Object.entries(stats) as [StatFieldName, number][]).map(
				([stat, value]) => (
					<StatBox
						key={stat}
						stat={stat}
						value={value}
						registerStat={registerStat}
					/>
				),
			)}
		</div>
	);
}
