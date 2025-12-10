import { useState } from "react";

export function Section({
	title,
	collapsible = false,
	children,
}: {
	title: string;
	collapsible?: boolean;
	children: React.ReactNode;
}) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	return (
		<div className="flex flex-col gap-2 my-4 justify-center items-stretch min-w-0">
			<h2 className="text-lg font-bold text-center text-theme-text-accent">
				<button
					type="button"
					onClick={() => {
						collapsible && setIsCollapsed(!isCollapsed);
					}}
				>
					{collapsible && (
						<span className="text-xs text-theme-text-secondary">
							{isCollapsed ? "▶ " : "▼ "}
						</span>
					)}{" "}
					{title}{" "}
					{collapsible && (
						<span className="text-xs text-theme-text-secondary">
							{isCollapsed ? " ◀" : "▼"}
						</span>
					)}
				</button>
			</h2>
			<div
				className={`flex flex-col gap-2 w-full min-w-0 overflow-hidden break-words ${isCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"}`}
			>
				{children}
			</div>
		</div>
	);
}
