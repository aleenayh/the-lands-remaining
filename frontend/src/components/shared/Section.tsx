import { useState } from "react";
import { ReactComponent as BorderIcon } from "../assets/border.svg";
import { Divider } from "./Divider";

export function Section({
	title,
	collapsible = false,
	minify = false,
	leftAlign = false,
	withDecoration = false,
	children,
}: {
	title: string;
	collapsible?: boolean;
	minify?: boolean;
	leftAlign?: boolean;
	withDecoration?: boolean;
	children: React.ReactNode;
}) {
	const [isCollapsed, setIsCollapsed] = useState(minify ?? false);
	return (
		<ControlledSection
			title={title}
			collapsible={collapsible}
			minify={minify}
			leftAlign={leftAlign}
			withDecoration={withDecoration}
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
	withDecoration = false,
	isCollapsed,
	setIsCollapsed,
	children,
}: {
	title: string;
	collapsible?: boolean;
	minify?: boolean;
	leftAlign?: boolean;
	withDecoration?: boolean;
	isCollapsed: boolean;
	setIsCollapsed: (isCollapsed: boolean) => void;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2 justify-center items-stretch min-w-0">
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
				className={`flex flex-col gap-2 w-full min-w-0 overflow-hidden break-words relative ${isCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"} ${withDecoration ? "border-2 border-theme-border-accent rounded-tl-lg rounded-br-lg" : ""} ${withDecoration && !isCollapsed ? "py-4 px-8 " : ""}`}
			>
				{children}
				{withDecoration && (
					<div className="absolute inset-0 h-full w-full pointer-events-none -z-[1]">
						<BorderIcon className="text-theme-border-accent absolute top-0 right-0 w-12 h-12 rotate-180" />
						<BorderIcon className="text-theme-border-accent absolute bottom-0 left-0 w-12 h-12 transform " />
					</div>
				)}
			</div>
			{isCollapsed && <Divider />}
		</div>
	);
}
