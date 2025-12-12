import { useEffect, useState } from "react";
import { ReactComponent as DeadTreeBg } from "./backgrounds/deadtree.svg";
import { ReactComponent as DiamondsBg } from "./backgrounds/diamonds.svg";
import { ReactComponent as ForestBg } from "./backgrounds/treeline.svg";
import { Drawers } from "./Drawers";
import { CharacterOverview } from "./playbooks/CharacterOverview";

export function Game() {
	return (
		<div className="flex flex-col w-full h-full p-4 overflow-hidden">
			<BackgroundOverlay />
			<Drawers />
			<div className="ml-8 flex-1 min-h-0 overflow-hidden z-[5]">
				<CharacterOverview />
			</div>
		</div>
	);
}

function BackgroundOverlay() {
	const [theme, setTheme] = useState(
		() => document.documentElement.getAttribute("data-theme") ?? "forest",
	);

	useEffect(() => {
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === "data-theme") {
					setTheme(
						document.documentElement.getAttribute("data-theme") ?? "forest",
					);
				}
			}
		});

		observer.observe(document.documentElement, { attributes: true });
		return () => observer.disconnect();
	}, []);

	return (
		<div className="absolute inset-x-0 bottom-0 color-theme-bg-secondary opacity-50">
			{theme === "forest" && <ForestBg className="w-full" />}
			{theme === "sagravelle" && (
				<div className="w-full flex justify-stretch">
					<DiamondsBg className="w-full" />
				</div>
			)}
			{theme === "nevask" && <DeadTreeBg className="w-1/3 mr-auto" />}
		</div>
	);
}
