import { ReactComponent as DandelionIcon } from "./icons/dandelion.svg";
import { ReactComponent as RoseIcon } from "./icons/rose.svg";
import { ReactComponent as SwallowIcon } from "./icons/swallow.svg";
import { ReactComponent as SwordIcon } from "./icons/sword.svg";
import type { MysteryTheme } from "./types";

export const themeElements: Record<
	MysteryTheme,
	{
		icon: React.ReactNode;
	}
> = {
	dandelion: {
		icon: <DandelionIcon className="w-10 h-10" />,
	},
	rose: {
		icon: <RoseIcon className="w-10 h-10" />,
	},
	sword: {
		icon: <SwordIcon className="w-10 h-10" />,
	},
	swallow: {
		icon: <SwallowIcon className="w-10 h-10" />,
	},
};
