import type { Abilities, Abilities as AbilityType } from "../types";

export function AbilityBoxes({ stats }: { stats: AbilityType }) {
	return (
		<div className={`flex flex-wrap justify-center gap-1`}>
			{orderAbilities(stats).map(({ ability, value }) => (
				<AbilityBox key={ability} ability={ability} value={value} />
			))}
		</div>
	);
}

export function orderAbilities(abilities: Abilities) {
	return order.map((stat) => ({
		ability: stat as keyof Abilities,
		value: abilities[stat as keyof Abilities],
	}));
}

const order = ["vitality", "composure", "reason", "presence", "cinder"];

type AbilityBoxProps = {
	ability: keyof AbilityType;
	value: number;
};

export function AbilityBox({ ability, value }: AbilityBoxProps) {
	return (
		<div className="flex flex-col gap-1 rounded-lg border border-theme-border-accent p-1 bg-theme-bg-secondary justify-center items-center min-w-[10%]">
			<h2 className="text-[0.7rem] text-theme-text-muted truncate max-w-full">
				{ability}
			</h2>
			<div className="text-center text-lg font-bold bg-transparent">
				{value}
			</div>
		</div>
	);
}
