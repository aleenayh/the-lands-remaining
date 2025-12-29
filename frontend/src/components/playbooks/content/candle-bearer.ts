import type { PlaybookBase } from "../types";

const oldFire = [
	"Narrate a flashback to your initiation into the Waxen Company of Candle-Bearers. What oath did you swear as your first candle was lit?",
	"Narrate a flashback to a time your light revealed something that was not meant to be seen. What was it? What were the consequences?",
	"Narrate a flashback to the ceremony when the Waxen Company gathered in darkness to light the Great Candle. What did you see in its glow that made you afraid?",
	"The Waxen Company saw the Dimning coming before anyone else. Narrate a flashback to their fruitless struggle against it.",
	"Narrate a flashback to the night when you were ordered to extinguish a light you could not bear to see go out. Whose was it? What happened?",
	"Narrate a flashback to the Last Vigil of the Waxen Company, the time just before the Dimning claimed all.",
	"Describe your solitary journey to the source of the Old Fire. What did you see? What message did the Old Fire give you before both you and it were extinguished?",
];

const fireToCome = {
	"The Kindling Gate":
		"Pick a Cinder (do not mark it if it is unmarked) and cross out all others; tell the other Embers they cannot mark The Kindling Gate on their own sheets. Take the Condition: Herald of [Name of Cinder]. Whenever you act in accordance with—or are negatively affected by—the Condition, mark a box below your Cinders. When all the boxes are marked, you can unmark them to unmark the Cinder. The Herald Condition cannot be cleared in the normal ways, but you can choose to clear it in order to get an automatic 12+ on a roll. If you do this, cross out The Kindling Gate.",
	"The Tinder Arch":
		"Tell the Keeper a Danger of their choice is drawn to your candles, no matter the distance in time and space, and that they have a new reaction: Moth to a Flame, which allows them to reveal said Danger.",
	"The Hearth's Fuel":
		"The lost and beleaguered souls of this world are moving toward your light. Narrate a scene somewhere else in the world showing this pilgrimage.",
	"The Ashen Passage":
		"Increase Cinder by 1 (max 3) and decrease another ability of your choice by 1.",
	"The Pyre's Crown":
		"Narrate the moment you turn from the company and walk alone toward the Throne at the heart of the Old Capital. Then, at the end of this play session, read Ascend the Throne.",
} as const;

export const CandleBearer: PlaybookBase = {
	title: "The Candle-Bearer",
	intro: [
		"You were born to bear the light. When the world began to dim, it was the Waxen Company of Candle-Bearers who kept the fires burning—pilgrims of flame walking into the depths where sunlight failed. Their glow lit the paths of kings, the graves of saints, and the hollowed hearts of those who still prayed for dawn.",

		"But even their thousand candles could not hold back the Dimning forever. The courage of men melted like wax, and the shadows crept closer, patient and endless. One by one, the lights guttered, until only the Last Vigil remained: a circle of candles burning in a sea of night, the Waxen Company kneeling within, in sorrow. You remember their faces, half-lit, half-consumed, as the darkness took them and left you alone to carry the glow forward.",

		"You sought whatever was left of the Old Fire.",

		"And then your own candle went out.",
	],
	names: [
		"Alyndra",
		"Beryn",
		"Corinelle",
		"Darev",
		"Elyss",
		"Fenric",
		"Gavren",
		"Haleen",
		"Istren",
		"Jeyna",
		"Kaelor",
		"Luneth",
		"Maedrin",
		"Norya",
		"Othil",
		"Perris",
		"Ruvane",
		"Selka",
		"Tirren",
		"Vael",
	],
	honorifics: [
		"the Steadfast Flame",
		"the Guiding Hand",
		"the Everlit",
		"the Guttering",
		"the Smoke-Touched",
		"the Faithful Glow",
		"the Luminous",
		"the Lantern-Born",
		"the Watchful Glow",
		"the Waxwright",
		"the Haloed",
		"the Ashlight",
		"the Kindled",
		"the Flickering",
		"the Last Spark",
		"the Long Vigil",
		"the Burnished",
		"the Light-Keeper",
		"the Shining",
		"the Soft-Burning",
	],
	look: [
		"wax-slick hair gathered with cord",
		"eyes that flicker like candlelight",
		"skin streaked with hardened wax",
		"face smooth and pale, like fresh tallow",
		"wax dripping from your ears like slow tears",
		"faint scent of smoke and honey",
		"neck wound in cloth blackened by soot",
		"shoulders dusted with ash, faintly warm to the touch",
		"robes riddled with burn holes and wax stains",
		"wax-sealed medallion resting against your chest",
		"melted candle stubs strapped to a bandolier",
		"arms streaked with wax like armor",
		"hands coated in wax that never fully cools",
		"belt hung with small tins of oil and wicks",
		"wax pooling at your knees, hardened in motion",
		"legs wrapped in scorched linen",
		"wax-slicked skin reflecting faint light as you move",
		"bare feet leaving prints of soot",
		"toes cracked and blackened",
	],
	rituals: [
		"The Cleansing Flame",
		"Wick Whispering",
		"The Lighting of Three Flames",
		"The Extinguishing Prayer",
		"The Drip Vigil",
	],
	questions: [
		"Did your light reveal something that others would rather remain hidden?",
		"Did you risk yourself to bring hope or illumination into a dark place?",
		"Did you deliver a trembling monologue about the dying of the light?",
		"Did you find beauty in what should have been left unseen?",
		"Did you share your fire with another, or take theirs from them?",
	],
	abilities: {
		vitality: 0,
		composure: 2,
		reason: 0,
		presence: 1,
		cinder: -2,
	},
	cinders: {
		1: "The Watchful Flame - Light reveals what burns within.",
		2: "The Burden of Wax - All illumination comes at a cost.",
		3: "The Long Night - The dark is patient, and it always returns.",
		4: "The Kindled Heart - To bear light is to burn.",
		5: "The Last Glow - Even the smallest flame defies eternity.",
	} as const,
	relics: [
		{
			title: "The Burning Branch",
			text: "A <aspect>heavy, staff-like candelabra made of iron</aspect>. When used to <aspect>light the way in the dark places of the world</aspect>, its dozen or so candles <aspect>cannot be extinguished</aspect>.",
			extraLines: 2,
		},
		{
			title: "The Nullwick",
			text: "A candle-snuffer with the <aspect>vows of the Waxen Order engraved upon it in reverse</aspect>. It can <aspect>extinguish a flame no bigger than a campfire</aspect> from several paces away, <aspect>creating an unusually deep and complete darkness</aspect>.",
			extraLines: 2,
		},
		{
			title: "The Ever-Crucible",
			text: "A ceramic vessel, cool to the touch, containing <aspect>a heat that burns ten times hotter than a forge</aspect>. It is said to contain <aspect>all that remains of the Old Fire</aspect>.",
			extraLines: 2,
		},
	],
	oldFire,
	fireToCome,
	ascendTheThrone: [
		"Word has passed through the ruins and graveyards: the Candle-Bearer has reached the Throne. The pilgrims arrive barefoot, shivering, eyes alight with fever. Some carry candles, others carry knives. None speak. They kneel, and when they rise, they begin the work.",

		"They strip away your robes first—folding them neatly, as if for burial—and smear your skin with unguent wax gone gray with age. The air fills with the scent of tallow and salt. The Burning Branch is placed across your shoulders like a yoke.",
		"Then the pouring begins.",
		"At first the wax is merely warm, running down your arms and chest in pale ribbons, sealing each breath against your ribs. But the pilgrims bring more—pots of molten wax black with smoke, ladles carved from bone—and the warmth becomes pain. It pools in the hollows of your eyes, in the crease of your mouth. It fills your ears until the world goes silent.",
		"The wax builds layer upon layer, ribs disappearing, jaw fixed in a permanent gasp. Fingers fuse around the candelabra’s iron haft. The smell of burning skin sweetens to incense. The wax takes on the shape of wings, of ribs, of faces half-formed and sinking back into the mass.",
		"When they finish, the pilgrims anoint the hollow where your heart should be with molten gold. A wick is driven deep into it.",
		"What will happen if the pilgrims place their creation on the Throne?",
		"Does your light cleanse the world of darkness, or does it send the weak, the timid, the powerless scrambling for the shadows? Does it deliver the world from darkness, or simply prove that everything can burn?",
	],
	moves: [
		{
			title: "…And Our Hearts Burn Unafraid.",
			text: [
				"You can mark Wax to burn candles whose scent and light ease the worries and invigorate the hearts of your companions. When you do so, any Ember (including you) in the effective area ignores the effects of all Conditions so long as they are in the area. The size of the area depends on how many Wax boxes you mark.",
				"<li>1 Wax — A small room or short corridor.</li>",
				"<li>2 Wax — A whole Location.</li>",
				"<li>3 Wax — A whole Mystery.</li>",
				"The candles will burn until the next time you take a Journey.",
			],
		},
		{
			title: "In Light We Are Sheltered…",
			text: [
				"You can mark Wax to arrange protective candles around a dangerous campsite. If you do so, when you Make Camp in a dangerous place, only you have to speak of what you’re afraid will happen, and the roll is made with advantage.",
			],
		},
		{
			title: "…In Shadow We Seek…",
			text: [
				"You can mark Wax to burn a candle whose flame will always flicker toward what you seek. If you do, name a person, place, or object that might reasonably be found within a mile or two. The candle will lead you there safely.",
			],
		},
		{
			title: "…And I Am a Beacon Most Lonely.",
			text: [
				"When you walk through a Location with no other Embers present, the light of your candle acting as a beacon to the dark things in the world, roll with Cinder. On a hit, a Danger or Threat is drawn to you. You may ask them two questions from the list below. They will not answer directly, but in the form of a Clue. On a 10+, the Threat or Danger departs as soon as the questions are answered.",
				"<li>Where is your lair?</li>",
				"<li>How can I get you to ________?</li>",
				"<li>What do you intend to do?</li>",
				"<li>What do you want from ________?</li>",
				"<li>What frightens you?</li>",
			],
		},
	],
};
