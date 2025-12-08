import type { FieldValues, UseFormRegister } from "react-hook-form";
import type { Stats as StatsType } from "../types";

type StatFieldName =
	| "vitality"
	| "composure"
	| "reason"
	| "presence"
	| "cinder";

type StatsProps = {
	stats: StatsType;
	registerStat?: (
		name: StatFieldName,
	) => ReturnType<UseFormRegister<FieldValues>>;
};

export function Stats({ stats, registerStat }: StatsProps) {
	return (
		<div
			className={`flex flex-wrap justify-center ${registerStat ? "gap-2" : "gap-1"}`}
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

type StatBoxProps = {
	stat: StatFieldName;
	value: number;
	registerStat?: (
		name: StatFieldName,
	) => ReturnType<UseFormRegister<FieldValues>>;
};

export function StatBox({ stat, value, registerStat }: StatBoxProps) {
	const baseClasses =
		"flex flex-col gap-1 rounded-lg border border-theme-border-accent p-2 bg-theme-bg-secondary justify-center items-center min-w-[60px]";
	const labelClasses = "text-xs text-theme-text-muted truncate max-w-full";
	const inputClasses = registerStat
		? "text-center text-xl font-bold bg-transparent w-[50px] -mr-2"
		: "text-center text-lg font-bold bg-transparent w-[40px] -mr-2";

	if (registerStat) {
		return (
			<div className={baseClasses}>
				<h2 className={labelClasses}>{stat}</h2>
				<input
					type="number"
					defaultValue={value}
					{...registerStat(stat)}
					className={inputClasses}
				/>
			</div>
		);
	}

	return (
		<div className={baseClasses}>
			<h2 className={labelClasses}>{stat}</h2>
			<input
				type="number"
				value={value}
				disabled={!registerStat}
				readOnly
				className={inputClasses}
			/>
		</div>
	);
}
