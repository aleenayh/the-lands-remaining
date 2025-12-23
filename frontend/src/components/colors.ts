export const colors: Record<string, { h: number; s: number; l: number }> = {
	Mosque: { h: 191, s: 100, l: 19 },
	Blue: { h: 240, s: 100, l: 50 },
	Green: { h: 83, s: 100, l: 18 },
	Yellow: { h: 45, s: 100, l: 50 },
	Red: { h: 360, s: 100, l: 50 },
	Purple: { h: 270, s: 100, l: 50 },
	Orange: { h: 30, s: 100, l: 50 },
	Brown: { h: 30, s: 100, l: 50 },
	Finn: { h: 334, s: 39, l: 31 },
	Olive: { h: 79, s: 64, l: 34 },
	White: { h: 0, s: 0, l: 100 },
};

export function colorFromTheme(): keyof typeof colors {
	const theme = document.documentElement.getAttribute("data-theme");

	if (theme === "forest") return "Olive";
	if (theme === "sagravelle") return "Red";
	if (theme === "nevask") return "Mosque";
	if (theme === "dark") return "Yellow";
	if (theme === "light") return "Purple";
	return "Purple";
}
