import type { AnchoressContent } from "../types";

export const berythContent: AnchoressContent = {
	name: "Sister Beryth",
	prayer: {
		intro:
			"In the time of the Old Fire, Beryth was a young noblewoman, a scion of House Virell. By praying with her, you recall the story of her betrothal to a young lord of House Durellan, and the bloody conflict that resulted from it. ",
		prompts: [
			"Narrate a flashback showing the moment Beryth learns she is to be wed to Auvrane, a young lord of House Durellan. What hope, relief, and/or quiet dread does she feel, and what does this union promise for House Virell here at the height of the Old Fire’s dominion?",
			"Narrate a flashback to the first sign that House Thornvale will not accept the betrothal. What slight—real or imagined—do they seize upon, and how does it reveal the fragile pride and old grievances simmering beneath courtly politeness?",
			"The grudge between the three great houses breaks out into open conflict. Whose blood is spilled first, and how is Beryth used by all three houses as the violence spreads?",
			"Narrate a flashback to the moment Beryth understands that the war cannot be undone. What decision does she make, and how does it cost her her name, her future, and her place long before the Dimning arrives?",
		],
	},
	quest: {
		description:
			"Three houses bled my life away and called it honor. Virell presented the knife wrapped in silk, Durellan named the blade love, and Thornvale sharpened it in secret. I care not that their great estates have fallen to the Dimning; I will know no contentment while even a single heir walks this blighted land. Take one life from each house and be my vengeance.",
		checkboxes: 3,
	},
	fires: [
		"Each Ember narrates a flashback to when they were offered something beautiful—love, honor, belonging, or something else—that they later realized came with a hidden cost. ",
		"Each Ember narrates a flashback to a time when their name or role was used by others to justify violence or suffering. ",
		"Each Ember narrates a flashback to when loyalty demanded something from them that felt wrong. ",
		"Each Ember narrates a flashback to when a relationship was transactional: a bond measured in advantage or power, rather than care. How did they push back against that framing, or how did they internalize it?",
		"Each Ember narrates a flashback to when they realized a conflict around them had already gone too far to stop. ",
	],
};
