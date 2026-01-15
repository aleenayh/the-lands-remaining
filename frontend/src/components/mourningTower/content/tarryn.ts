import type { AnchoressContent } from "../types";

export const tarrynContent: AnchoressContent = {
	name: "Saint Tarryn the Stylite",
	prayer: {
		intro:
			"Tarryn was a stylite in the time of the Old Fire, one of the so-called pillar-saints who lived, preached, and prayed atop tall columns of stone set at crossroads. By praying with her, you recall her philosophical debate with the Dimning itself. ",
		prompts: [
			"Narrate a flashback showing Tarryn’s life upon the pillar. What did she give up to remain there, and what authority did her stillness grant her over those who gathered below?",
			"Narrate a flashback to the first time the Dimning appears to Tarryn, not as shadow, but as a person. Describe its form, its voice, and why Tarryn does not sense the danger of it.",
			"Narrate a flashback to their ongoing debates. What question does the Dimning press that Tarryn cannot dismiss, and what answer of hers begins to feel rehearsed rather than true?",
			"Narrate a flashback to the moment Tarryn climbs down from her pillar. What argument finally convinces her to descend, and what does she feel the instant her feet touch the earth again?",
		],
	},
	quest: {
		description:
			"I stood above the world so I could see it clearly. I was wrong. Truth moves along roads, not up and down pillars. Go now and seek the other stylites who still cling to height and certainty. Visit the three remaining pillar-saints of this world, and ask them what they believe they are still standing above. Make them answer honestly, whether they descend or not.",
		checkboxes: 3,
	},
	fires: [
		"Each Ember narrates a flashback to a time when distance—physical, emotional, or moral—made them feel wiser than those around them.",
		"Each Ember narrates a flashback to when someone challenged their beliefs not with force, but with questions that lingered.",
		"Each Ember narrates a flashback to a moment when conviction hardened into performance rather than softening into understanding.",
		"Each Ember narrates a flashback to a time when stepping down felt more dangerous than remaining aloft.",
		"Each Ember narrates a flashback to when they realized wisdom required rejoining the world they had withdrawn from.",
	],
};
