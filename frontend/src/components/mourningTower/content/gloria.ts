import type { AnchoressContent } from "../types";

export const gloriaContent: AnchoressContent = {
	name: "Mother Gloria",
	prayer: {
		intro:
			"In the time of the Old Fire, Gloria was a young nun of little renown until the gods granted her a vision of the Dimning. By praying with her, you recall the story of her fruitless efforts to convince learned men of what she saw. ",
		prompts: [
			"Narrate a flashback showing the moment then-Sister Gloria receives her vision. Where is she, what form does the vision take, and what detail convinces her this is not metaphor, dream, or madness, but a true revelation of what is to come?",
			"Narrate a flashback to her first attempt to warn others. Who does she approach, and how do they politely dismiss her words? What explanation do they offer that almost makes her doubt herself?",
			"Narrate a flashback showing how Gloria’s warnings grow more desperate as the signs she foresaw begin to appear. What proof does she bring, and what personal cost does she pay as her reputation fractures under accusations of heresy, hysteria, or pride?",
			"Narrate a flashback to the moment Gloria realizes knowledge itself has become a shelter from responsibility. What oath does she swear then, and how does that oath become the beginning of the Long Wake?",
		],
	},
	quest: {
		description:
			"They wrapped themselves in learning, holiness, and foresight—and used all three to excuse their inaction. Go to them. Release an oracle from the burden of prophecy, remove a scholar from his studies, and turn a holy man away from his prayers and entreaties. Each must finally see what their certainty has cost them.",
		checkboxes: 3,
	},
	fires: [
		"Each Ember narrates a flashback to a time when they knew something terrible was coming and tried to warn others, but were ignored, ridiculed, or dismissed.",
		"Each Ember narrates a flashback to a moment when they doubted their own judgment because authority, expertise, or tradition told them they were wrong.",
		"Each Ember narrates a flashback to when they chose to endure rather than act.",
		"Each Ember narrates a flashback to when faith, conviction, or certainty isolated them from people they once trusted.",
		"Each Ember narrates a flashback to a time when being right mattered less than being believed, and how that distinction changed them.",
	],
};
