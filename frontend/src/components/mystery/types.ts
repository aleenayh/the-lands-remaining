export type Question = {
	text: string;
	complexity: number;
};
export type Mystery = {
	title: string;
	questions: Question[];
	theme: MysteryTheme;
	countdownTotal: number;
	countdownCurrent: number;
};

export enum MysteryTheme {
	Dandelion = "dandelion",
	Rose = "rose",
	Sword = "sword",
	Swallow = "swallow",
}
