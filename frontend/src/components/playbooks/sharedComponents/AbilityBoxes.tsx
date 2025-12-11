import type { Abilities, Abilities as AbilityType } from "../types";

export function AbilityBoxes({
	stats,
	abbreviate = false,
}: {
	stats: AbilityType;
	abbreviate?: boolean;
}) {
	return (
		<div className={`flex justify-center gap-1 mx-0 md:mx-auto`}>
			{orderAbilities(stats).map(({ ability, value }) => (
				<AbilityBox
					key={ability}
					ability={ability}
					value={value}
					abbreviate={abbreviate}
				/>
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
	abbreviate?: boolean;
};

export function AbilityBox({
	ability,
	value,
	abbreviate = false,
}: AbilityBoxProps) {
	return (
		<div className="flex flex-col gap-1 rounded-lg border border-theme-border-accent p-1 bg-theme-bg-secondary justify-center items-center min-w-[10%]">
			<h2 className="text-theme-text-muted text-[0.5rem] truncate max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
				{abbreviate ? ability.slice(0, 4) : ability}
			</h2>
			<div className="text-center text-lg font-bold bg-transparent">
				{value}
			</div>
		</div>
	);
}
