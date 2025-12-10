import { ReactComponent as DandelionIcon } from "./icons/dandelion.svg";
import { ReactComponent as RoseIcon } from "./icons/rose.svg";
import { ReactComponent as SwallowIcon } from "./icons/swallow.svg";
import { ReactComponent as SwordIcon } from "./icons/sword.svg";

type Mystery = {
	title: string;
	theme: keyof typeof themeElements;
	countdownTotal: number;
	countdownCurrent: number;
};

export function Countdown({ mystery }: { mystery: Mystery }) {
	const { initialColor, filledColor, textColors } =
		themeElements[mystery.theme];
	const localTheme = localStorage.getItem("theme") || "forest";
	const useHighContrastDark = localTheme === "dark";
	const useHighContrastLight = localTheme === "light";
	const gradient = textColors
		? `linear-gradient(to bottom, hsl(${textColors.top.h}, ${textColors.top.s}%, ${textColors.top.l}%), hsl(${textColors.bottom.h}, ${textColors.bottom.s}%, ${textColors.bottom.l}%))`
		: `linear-gradient(to bottom, hsl(${initialColor.h}, ${initialColor.s}%, ${initialColor.l}%), hsl(${filledColor.h}, ${filledColor.s}%, ${filledColor.l}%))`;

	const style = useHighContrastDark
		? {
				color: "#fff",
			}
		: useHighContrastLight
			? {
					color: "#000",
				}
			: {
					background: gradient,
					backgroundClip: "text",
					color: "transparent",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
				};
	return (
		<div>
			<h1 className="text-xl text-center mb-2 whitespace-nowrap" style={style}>
				{mystery.title}
			</h1>
			<div
				className={`flex gap-3 min-h-[100px] justify-center items-center mx-auto`}
			>
				{Array.from({ length: mystery.countdownTotal }).map((_, index) => (
					<CountdownItem
						key={`mc-${mystery.title}-${index}`}
						theme={mystery.theme}
						index={index}
						filled={mystery.countdownCurrent > index}
					/>
				))}
			</div>
			<div className="text-theme-text-secondary text-sm">
				{mystery.countdownCurrent} / {mystery.countdownTotal}
			</div>
		</div>
	);
}

function CountdownItem({
	theme,
	index,
	filled,
}: {
	theme: keyof typeof themeElements;
	index: number;
	filled: boolean;
}) {
	const { icon, initialColor, filledColor } = themeElements[theme];
	const yOffset = index % 2 === 0 ? -5 : 20;
	const rotation = index * 30;
	return (
		<div
			style={{ transform: `translateY(${yOffset}px) rotate(${rotation}deg)` }}
		>
			<div
				className="w-10 h-10 bg-theme-bg-secondary rounded-full"
				style={{
					color: `${filled ? `hsl(${filledColor.h}, ${filledColor.s}%, ${filledColor.l}%)` : `hsl(${initialColor.h}, ${initialColor.s}%, ${initialColor.l}%)`}`,
				}}
			>
				{icon}
			</div>
		</div>
	);
}

const colors = {
	pink: {
		h: 360,
		s: 100,
		l: 70,
	},
	burgundy: {
		h: 3,
		s: 70,
		l: 30,
	},
	ghost: {
		h: 50,
		s: 6,
		l: 80,
	},
	yellow: {
		h: 50,
		s: 70,
		l: 70,
	},
	silver: {
		h: 240,
		s: 100,
		l: 90,
	},
	blood: {
		h: 360,
		s: 100,
		l: 50,
	},
	ice: {
		h: 230,
		s: 50,
		l: 35,
	},
	lightblue: {
		h: 250,
		s: 50,
		l: 10,
	},
	blue: {
		h: 240,
		s: 30,
		l: 10,
	},
};

const themeElements: Record<
	string,
	{
		icon: React.ReactNode;
		font: string;
		initialColor: { h: number; s: number; l: number };
		filledColor: { h: number; s: number; l: number };
		textColors?: {
			top: { h: number; s: number; l: number };
			bottom: { h: number; s: number; l: number };
		};
	}
> = {
	dandelion: {
		icon: <DandelionIcon className="w-10 h-10" />,
		font: "Almendra",
		initialColor: colors.ice,
		filledColor: colors.ghost,
	},
	rose: {
		icon: <RoseIcon className="w-10 h-10" />,
		font: "Fleur",
		initialColor: colors.pink,
		filledColor: colors.burgundy,
	},
	sword: {
		icon: <SwordIcon className="w-10 h-10" />,
		font: "Pirata",
		initialColor: colors.silver,
		filledColor: colors.blood,
	},
	swallow: {
		icon: <SwallowIcon className="w-10 h-10" />,
		font: "Almendra",
		textColors: {
			top: colors.ghost,
			bottom: colors.ice,
		},
		initialColor: colors.ice,
		filledColor: colors.blue,
	},
};
