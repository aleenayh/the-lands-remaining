export function cleanBlockToStringArrays(text: string | string[]): string[] {
	if (Array.isArray(text)) {
		return text.map((item) => item.replace("\n", " "));
	}
	return text.split("\n\n").map((line) => line.replace("\n", " "));
}

export function cleanBlockToSingleString(text: string): string {
	const arrays = cleanBlockToStringArrays(text);
	return arrays.join("\n\n");
}
