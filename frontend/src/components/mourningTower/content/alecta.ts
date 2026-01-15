import type { AnchoressContent } from "../types";

export const alectaContent: AnchoressContent = {
	name: "Saint Alecta the Defiant",
	prayer: {
		intro:
			"In the time of the Old Fire, then-Sister Alecta was a revolutionary nun, toppling lords and kings in the name of the small folk. By praying with her, you recall her rebellions, including her last campaign, just before the Dimning snatched martyrdom from her.",
		prompts: [
			"Narrate a flashback showing the moment Alecta turns from prayer to rebellion. What injustice does she witness that convinces her words are no longer enough, and how does she sanctify violence in her own heart?",
			"Narrate a flashback to Alecta standing before a sovereign or lord she means to unseat. What accusation does she hurl at them, and what part of their power does she expose as hollow?",
			"Narrate a flashback showing the height of her uprising. Whose lives are improved by her actions, and whose suffering worsens as collateral? How does she justify the latter?",
			"Narrate a flashback to Alecta’s final stand. How does the Dimning rob her of martyrdom in the end?",
		],
	},
	quest: {
		description:
			"They ruled by inheritance and fear, and called it divine order. I sundered many crowns, but I did not break them all. Go where I could not and claim the hearts of three sovereigns.",
		checkboxes: 3,
	},
	fires: [
		"Each Ember narrates a flashback to a time when they chose action over obedience, knowing it would make them an enemy of authority.",
		"Each Ember narrates a flashback to when violence felt justified.",
		"Each Ember narrates a flashback to a moment when overthrowing a tyrant or otherwise dismantling authority did not make the world better in the way they hoped.",
		"Each Ember narrates a flashback to when they believed suffering was a necessary price for justice.",
		"Each Ember narrates a flashback to a time when they wanted to be remembered as a martyr or a hero. How does that desire make them feel now?",
	],
};
