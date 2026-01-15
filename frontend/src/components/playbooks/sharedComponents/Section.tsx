import { useState } from "react";

export function Section({
	title,
	collapsible = false,
	minify = false,
	leftAlign = false,
	children,
}: {
	title: string;
	collapsible?: boolean;
	minify?: boolean;
	leftAlign?: boolean;
	children: React.ReactNode;
}) {
	const [isCollapsed, setIsCollapsed] = useState(minify ?? false);
	return (
		<ControlledSection
			title={title}
			collapsible={collapsible}
			minify={minify}
			leftAlign={leftAlign}
			isCollapsed={isCollapsed}
			setIsCollapsed={setIsCollapsed}
		>
			{children}
		</ControlledSection>
	);
}

export function ControlledSection({
	title,
	collapsible = false,
	minify = false,
	leftAlign = false,
	isCollapsed,
	setIsCollapsed,
	children,
}: {
	title: string;
	collapsible?: boolean;
	minify?: boolean;
	leftAlign?: boolean;
	isCollapsed: boolean;
	setIsCollapsed: (isCollapsed: boolean) => void;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2 my-4 justify-center items-stretch min-w-0">
			<h2
				className={`font-bold ${leftAlign ? "text-left" : "text-center"} text-theme-text-accent ${minify ? "text-sm" : "text-lg"}`}
			>
				<button
					type="button"
					onClick={() => {
						collapsible && setIsCollapsed(!isCollapsed);
					}}
				>
					{collapsible && !leftAlign && (
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
