import type { MysteryContent } from "../../types";

export const ElegyMysteries: MysteryContent[] = [
	{
		title: "Elegy",
		intro: [
			"You have awoken here, pulled from your tomb by the faint warmth of the Old Fire still pulsing in your chest. The sea that surrounds you—as much as you can make out in the fog—is gray and still. At the island’s center rises the Mourning Tower, tall and black against the mist. The nuns there can tell you more about this world, and help you in your future trials, but the Tower’s doors are sealed. Additionally, the only way off the island, the only way to reach the Lands Remaining, is the little boat called Pale Crossing, but you must first learn to call it. ",
		],
		questionsAndOpportunities: [
			{
				question: "How can we call Pale Crossing back to the shores of Elegy?",
				complexity: 6,
				opportunity:
					"Call Pale Crossing and immediately engage in a Struggle against the Boatman. Then, resolve the Mystery by taking the Journey to the Lands Remaining aboard Pale Crossing.",
			},
			{
				question: "How do we open the doors to the Mourning Tower?",
				complexity: 8,
				opportunity:
					"Gain access to the first level of the Mourning Tower and immediately engage in a Struggle against the Pall-Bearer. \n\n Special: This Question can be answered after the Mystery is resolved, and any future Clue can be applied to it rather than the Mystery where it was found.",
			},
		],
		countdownTotal: 0,
		rewards: {
			supplicants: {
				Veyra:
					"Gain one extra Clue on the Information Move when consulting her about matters related to assassins, the dead, or secret orders, even on a miss.",
				"Sir Calen":
					"Gain one extra Clue on the Information Move when consulting him about matters related to roads and paths, even on a miss.",
			},
			items: [
				"Bell of the Long Wake: A small handbell, tarnished and cracked, that <rings without sound.> The bell <grows colder each time it’s used.>",
				"Mourner’s candle: A long black candle that <never shortens.> When lit beside the dying or the dead, <the flame turns blue and whispers their final thoughts aloud.>",
				"Moonlight shroud: A funerary cloth woven from grave moss and moonlight. When wrapped around a body—or yourself—it <masks breath and heartbeat>, <hiding the living from spirits and the restless dead.>",
				"Gravedigger’s nail: A single rusted coffin nail, worn smooth from frequent handling. When pressed into the palm, it <lets you sense hollow spaces, buried things, or the nearness of graves.>",
				"Salt of the Departed: A small pouch of coarse gray salt said to be <drawn from the tears of the dead.> Scattered in a circle, it <wards off spirits and shades until the circle is broken.>",
			],
		},
	},
];
