export function CloseTrayButton({ close }: { close: () => void }) {
	return (
		<button
			type="button"
			className="absolute top-4 right-4 w-8 h-8 font-bold text-xl text-theme-text-muted hover:text-theme-text-accent"
			onClick={close}
		>
			«
		</button>
	);
}
