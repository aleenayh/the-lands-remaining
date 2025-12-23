/**
 * Parse relic text and render <aspect> tags with checkboxes
 */
export function parseRelicText(
	text: string,
	relicAspects: number[],
	startIndex: number,
	editable: boolean,
	onToggle: (index: number) => void,
): { elements: React.ReactNode; nextAspectIndex: number } {
	const parts: React.ReactNode[] = [];
	let currentIndex = startIndex;
	let lastEnd = 0;

	// Match all <aspect>...</aspect> patterns
	const regex = /<aspect>(.*?)<\/aspect>/g;
	let match = regex.exec(text);

	while (match !== null) {
		// Add text before this aspect
		if (match.index > lastEnd) {
			const formattedStaticText = parseStaticText(
				text.slice(lastEnd, match.index),
			);
			parts.push(formattedStaticText);
		}

		const aspectText = match[1];
		const aspectIndex = currentIndex;
		const isChecked = relicAspects[aspectIndex] === 1;

		parts.push(
			<AspectSpan
				key={`aspect-${aspectIndex}`}
				text={aspectText}
				checked={isChecked}
				editable={editable}
				onToggle={() => onToggle(aspectIndex)}
			/>,
		);

		currentIndex++;
		lastEnd = match.index + match[0].length;
		match = regex.exec(text);
	}

	// Add remaining text after last aspect
	if (lastEnd < text.length) {
		const formattedStaticText = parseStaticText(text.slice(lastEnd));
		parts.push(formattedStaticText);
	}

	return { elements: parts, nextAspectIndex: currentIndex };
}

function AspectSpan({
	text,
	checked,
	editable,
	onToggle,
}: {
	text: string;
	checked: boolean;
	editable: boolean;
	onToggle: () => void;
}) {
	return (
		<span>
			<button
				type="button"
				onClick={onToggle}
				disabled={!editable}
				className={`inline-block align-middle w-3 h-3 border rounded-sm text-[8px] leading-[0.6rem] text-center mr-0.5 ${
					checked
						? "bg-theme-accent-primary border-theme-accent-primary text-white"
						: "border-theme-border-accent bg-transparent"
				} ${editable ? "cursor-pointer hover:border-theme-accent-primary" : "cursor-default opacity-70"}`}
				aria-label={checked ? "Uncheck aspect" : "Check aspect"}
			>
				{checked && "✓"}
			</button>
			<strong
				className={`${checked ? "line-through opacity-60" : ""} text-theme-text-accent font-extrabold`}
			>
				{text}
			</strong>
		</span>
	);
}

/**
 * Parse text into formatted segments: lists, headers, strong, etc.
 * does not parse dynamic text like aspects
 * @param text
 */
export function parseStaticText(text: string): React.ReactNode {
	const parts: React.ReactNode[] = [];
	let lastEnd = 0;

	// Combined regex to match all tag types in order of appearance
	const tagRegex = /<(h2|li|strong)>(.*?)<\/\1>/g;
	let match = tagRegex.exec(text);

	while (match !== null) {
		// Add text before this match
		if (match.index > lastEnd) {
			parts.push(text.slice(lastEnd, match.index));
		}

		const [fullMatch, tagName, content] = match;

		// Add the formatted element based on tag type
		switch (tagName) {
			case "h2":
				parts.push(<h2 key={match.index}>{content}</h2>);
				break;
			case "li":
				parts.push(
					<li key={match.index} className="ml-4">
						{content}
					</li>,
				);
				break;
			case "strong":
				parts.push(<strong key={match.index}>{content}</strong>);
				break;
		}

		lastEnd = match.index + fullMatch.length;
		match = tagRegex.exec(text);
	}

	// Add remaining text after the last match
	if (lastEnd < text.length) {
		parts.push(text.slice(lastEnd));
	}

	return parts;
}
