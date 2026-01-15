import type { AnchoressContent } from "../types";

export const shereenContent: AnchoressContent = {
	name: "Sister Shereen",
	prayer: {
		intro:
			"When the Dimning came, women previously revered as healers were branded witches by scared, small-minded folk looking for someone to blame for the troubles. By praying with Sister Shereen, you recall her efforts to build community with these outcast women.",
		prompts: [
			"Narrate a montage in flashback showing the first wave of accusations. What ordinary acts of care are twisted into proof of witchcraft, and how are these women made to suffer?",
			"Narrate a flashback to the lives of the accused after they are cast out. Where do they live, how do they survive, and what kindness keeps them from despair?",
			"Narrate a flashback showing Shereen entering this world on the margins. What does she offer first, and why do the women decide to trust her?",
			"Narrate a flashback to the moment this scattered group becomes a true community. What shared ritual or act of care binds them together?",
		],
	},
	quest: {
		description:
			"They were driven from hearth and hall, to places where the world is cold. I relit the fires for them as best I could. Go now, and rest where warmth is still freely given. Sit at three welcoming hearth fires, places where no one asks what you are, only whether you are fed. Stay long enough for the fire to know you were there.",
		checkboxes: 3,
	},
	fires: [
		"Each Ember narrates a flashback to a time when simple comfort meant more than any victory.",
		"Each Ember narrates a flashback to when they found belonging among people the world had cast aside.",
		"Each Ember narrates a flashback to a moment when tenderness felt like defiance.",
		"Each Ember narrates a flashback to a time when resting or tending others was the most noble choice.",
		"Each Ember narrates a flashback to something small and gentle they fear losing forever in this new world.",
	],
};
