export function GlassyButton({
	children,
	onClick,
	disabled = false,
	row = false,
}: {
	children: React.ReactNode;
	onClick: () => void;
	disabled?: boolean;
	row?: boolean;
}) {
	const theme = document.documentElement.getAttribute("data-theme");
	const addBg = theme === "elegy";
	return (
		<button
			type="button"
			className={`px-4 py-4 rounded-lg bg-opacity-20 text-theme-text-accent flex ${row ? "flex-row justify-center" : "flex-col justify-start"} ${addBg ? "bg-theme-bg-secondary  bg-opacity-20" : ""} items-center gap-1 border border-theme-border backdrop-blur-sm
      hover:filter hover:brightness-150 transition-filter`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
