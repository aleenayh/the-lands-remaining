import { ReactComponent as DandelionIcon } from "./icons/dandelion.svg";
import { ReactComponent as RoseIcon } from "./icons/rose.svg";
import { ReactComponent as SwallowIcon } from "./icons/swallow.svg";
import { ReactComponent as SwordIcon } from "./icons/sword.svg";
import type { MysteryTheme } from "./types";

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

export const themeElements: Record<
	MysteryTheme,
	{
		icon: React.ReactNode;
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
		initialColor: colors.ice,
		filledColor: colors.ghost,
	},
	rose: {
		icon: <RoseIcon className="w-10 h-10" />,
		initialColor: colors.pink,
		filledColor: colors.burgundy,
	},
	sword: {
		icon: <SwordIcon className="w-10 h-10" />,
		initialColor: colors.silver,
		filledColor: colors.blood,
	},
	swallow: {
		icon: <SwallowIcon className="w-10 h-10" />,
		textColors: {
			top: colors.ghost,
			bottom: colors.ice,
		},
		initialColor: colors.ice,
		filledColor: colors.blue,
	},
};
