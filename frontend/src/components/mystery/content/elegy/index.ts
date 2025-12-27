import type { MysteryContent } from "../../types";

export const ElegyMysteries: MysteryContent[] = [
	{
		title: "Elegy",
		intro: [
			"You have awoken here, pulled from your tomb by the faint warmth of the Old Fire still pulsing in your chest. The sea that surrounds you—as much as you can make out in the fog—is gray and still. At the island’s center rises the Mourning Tower, tall and black against the mist. The nuns there can tell you more about this world, and help you in your future trials, but the Tower’s doors are sealed. Additionally, the only way off the island, the only way to reach the Lands Remaining, is the little boat called the Pale Crossing, but you must first learn to call it. ",
		],
		questionsAndOpportunities: [
			{
				question:
					"How can we call the Pale Crossing back to the shores of Elegy?",
				complexity: 6,
				opportunity:
					"Call the Pale Crossing and immediately engage in a Struggle against the Boatman. Then, resolve the Mystery by taking the Journey to the Lands Remaining aboard the Pale Crossing.",
			},
			{
				question: "How do we open the doors to the Mourning Tower?",
				complexity: 8,
				opportunity:
					"Gain access to the first level of the Mourning Tower and immediately engage in a Struggle against the Pall-Bearer. \n\n Special: This Question can be answered after the Mystery is resolved, and any future Clue can be applied to it rather than the Mystery where it was found.",
			},
		],
		countdownTotal: 0,
		clues: [
			"Footprints leading to a grave—but none leading away.",
			"A torn page from a litany, certain names scratched out.",
			"A key made of blackened glass, too fragile to turn.",
			"An open coffin containing a perfectly preserved hand, palm up.",
			"A trail of candle wax leading into the sea.",
			"A skeleton laid out for burial with no skull, only a mirror in its place.",
			"The body of a drowned monk, hands clasped around a stone engraved with the word “Return.”",
			"A grave marker inscribed with (pick one: a strange sigil, a poem, a jumbled compass rose, something else).",
			"A whisper carried on the wind: “The sea remembers.”",
			"A length of funeral cloth tied into a noose, but used as (pick one: a bookmark in a hymnal, a sash around a Side Character’s waist, a bandage over a healed wound, something else).",
			"A crow perched on a tomb, holding (pick one: a bead of obsidian, a pale gem, an eye, something else) in its beak.",
			"A shallow grave filled not with bones but with river stones, each marked with a symbol of the Old Fire.",
			"A cluster of candles whose flames lean toward a single point before guttering out.",
			"A shattered mirror whose shards reflect a bright sky instead of the fog.",
			"Dozens of dead moths arranged in the shape of (pick one: a bell, a lantern, a heart, something else).",
			"The faint outline of a door drawn in chalk on a crypt wall.",
			"The smell of incense in an unusual place.",
			"A cracked silver bowl filled with ashes that hum softly when stirred.",
			"A procession mask made of wax, still warm and pliable to the touch.",
			"A lantern that <burns with a pale violet flame, even without oil.>",
		],
	},
];
