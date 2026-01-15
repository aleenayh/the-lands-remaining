export function StyledTooltip({ children }: { children: React.ReactNode }) {
	return (
		<div className="backdrop-blur-lg text-theme-text-primary p-2 rounded-lg max-w-96 whitespace-normal break-words text-sm mb-2 border border-theme-border-accent">
			{children}
		</div>
	);
}
