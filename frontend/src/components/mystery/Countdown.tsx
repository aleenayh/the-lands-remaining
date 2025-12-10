import { useGame } from "../../context/GameContext";
import { PlayerRole } from "../../context/types";
import { themeElements } from "./themes";
import type { Mystery } from "./types";

export function Countdown({ mystery }: { mystery: Mystery }) {
	const {
		user: { role },
		gameState,
		updateGameState,
	} = useGame();
	const { initialColor, filledColor, textColors } =
		themeElements[mystery.theme];
	const localTheme = localStorage.getItem("theme") || "forest";
	const useHighContrastDark = localTheme === "dark";
	const useHighContrastLight = localTheme === "light";
	const gradient = textColors
		? `linear-gradient(to bottom, hsl(${textColors.top.h}, ${textColors.top.s}%, ${textColors.top.l}%), hsl(${textColors.bottom.h}, ${textColors.bottom.s}%, ${textColors.bottom.l}%))`
		: `linear-gradient(to bottom, hsl(${initialColor.h}, ${initialColor.s}%, ${initialColor.l}%), hsl(${filledColor.h}, ${filledColor.s}%, ${filledColor.l}%))`;

	const onToggle = (checked: boolean) => {
		updateGameState({
			mysteries: gameState.mysteries.map((m) =>
				m.title === mystery.title
					? {
							...m,
							countdownCurrent: checked
								? m.countdownCurrent + 1
								: m.countdownCurrent - 1,
						}
					: m,
			),
		});
	};
	const onRemove = () => {
		updateGameState({
			mysteries: gameState.mysteries.filter((m) => m.title !== mystery.title),
		});
	};

	const style = useHighContrastDark
		? {
				color: "#fff",
			}
		: useHighContrastLight
			? {
					color: "#000",
				}
			: {
					background: gradient,
					backgroundClip: "text",
					color: "transparent",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
				};
	return (
		<div>
			<h1 className="text-xl text-center mb-2 whitespace-nowrap" style={style}>
				{mystery.title}
			</h1>
			<div
				className={`flex gap-3 min-h-[100px] justify-center items-center mx-auto`}
			>
				{Array.from({ length: mystery.countdownTotal }).map((_, index) => (
					<CountdownItem
						key={`mc-${mystery.title}-${index}`}
						theme={mystery.theme}
						index={index}
						filled={mystery.countdownCurrent > index}
					/>
				))}
			</div>
			{role === PlayerRole.KEEPER && (
				<div className="flex gap-3 justify-center items-center">
					{Array.from({ length: mystery.countdownTotal }).map((_, index) => (
						<input
							type="checkbox"
							key={`mc-${mystery.title}-${index}`}
							defaultChecked={mystery.countdownCurrent > index}
							onChange={(e) => onToggle(e.target.checked)}
						/>
					))}
				</div>
			)}
			<div className="text-theme-text-secondary text-sm">
				{mystery.countdownCurrent} / {mystery.countdownTotal}
			</div>
			{mystery.questions && mystery.questions.length > 0 && (
				<div className="py-4 flex flex-col gap-2">
					<h2 className="text-md text-center whitespace-nowrap" style={style}>
						Questions
					</h2>
					{mystery.questions.map((question) => (
						<div key={question.text}>
							{question.text}{" "}
							<span className="text-sm text-theme-text-secondary italic">
								(Complexity: {question.complexity})
							</span>
						</div>
					))}
				</div>
			)}
			{role === PlayerRole.KEEPER && (
				<button
					type="button"
					onClick={onRemove}
					className="my-2 bg-theme-bg-accent text-theme-text-accent px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
				>
					Remove this mystery
				</button>
			)}
		</div>
	);
}

export function CountdownItem({
	theme,
	index,
	filled,
}: {
	theme: keyof typeof themeElements;
	index: number;
	filled: boolean;
}) {
	const { icon, initialColor, filledColor } = themeElements[theme];
	const yOffset = index % 2 === 0 ? -5 : 20;
	const rotation = index * 30;
	return (
		<div
			style={{ transform: `translateY(${yOffset}px) rotate(${rotation}deg)` }}
		>
			<div
				className="w-10 h-10 bg-theme-bg-secondary rounded-full"
				style={{
					color: `${filled ? `hsl(${filledColor.h}, ${filledColor.s}%, ${filledColor.l}%)` : `hsl(${initialColor.h}, ${initialColor.s}%, ${initialColor.l}%)`}`,
				}}
			>
				{icon}
			</div>
		</div>
	);
}
