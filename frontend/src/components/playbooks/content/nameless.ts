import type { PlaybookBase } from "../types";

export const Nameless: PlaybookBase = {
	title: "The Nameless",
	intro: [
		"You were once a knight of the Nameless Legion—an order so devoted to humility that its champions surrendered everything that set them apart: name, lineage, coat of arms. You claimed no titles, carved no sigils, and buried your victories beneath the soil you bled to defend.",

		"But no vow is strong enough to hold back pride. The Legion’s virtue curdled to vanity; its humility became hunger. You remember the halls where your brothers and sisters ate in silence, each secretly yearning for notoriety. You remember the moment when the Old Fire grew cold to you.",

		"Now, in this age of ruin, you rise again—a commander without name, bearing the arms of a forgotten host. The ghosts of your comrades follow, pale and patient, waiting for release. You can call them when the need is great, but each spirit must be named before it fades, freed at last from the burden of humility. You seek the truth of your Legion’s fall, and perhaps, redemption. And when you stand before the Throne of the Old King, you will take a name for yourself—one so true and terrible it will burn across the world.",
	],
	names: [
		"Shield",
		"Spear",
		"Banner",
		"Voice",
		"Anvil",
		"Hammer",
		"Thorn",
		"Oath",
		"Brand",
		"Lantern",
		"Grave",
		"Warden",
		"Coin",
		"Spire",
		"Rook",
		"Ash",
		"Lock",
		"Grail",
		"Knell",
		"Echo",
	],
	honorifics: [],
	look: [
		"close-cropped hair streaked with ash, trimmed with soldierly care",
		"long hair bound in a neat braid, oiled and orderly",
		"shorn scalp displaying ritual scars",
		"hair silvered early, brushed smooth despite the grime",
		"hollow eyes ringed with soot, still sharp with command",
		"a calm face, beautiful in its discipline",
		"worn gloves mended with golden thread",
		"linen gloves patched again and again, each stitch precise",
		"a cloak fastened with a polished bronze clasp",
		"a mantle of faded green, hem trimmed with exacting pride",
		"a pilgrim’s shawl, worn thin but carefully kept",
		"a plain gray tabard pressed smooth before battle",
		"a cape of crow feathers, arranged with quiet vanity",
		"shoulders wrapped in clean bandages",
		"a clean girded sash",
		"travel-stained vestments, spotless at the collar",
		"boots scuffed to silver",
		"heavy riding boots, gleaming even in mud",
	],
	rituals: [
		"Glinting the Blade",
		"The Recitation of Ranks",
		"The Naming of Shadows",
		"The Ash Offering",
		"The Mirror Vigil",
	],
	questions: [
		"Did you act in accordance with your vows, even when it cost you something precious?",
		"Did you name another—enemy, ally, or shade—and in doing so alter their fate?",
		"Did your pride reveal itself beneath the mask of humility?",
		"Did you hear the echo of the Legion in your deeds or words?",
		"Did you glimpse the person you once were, or the name you might yet take?",
	],
	abilities: {
		vitality: 2,
		composure: 1,
		reason: 0,
		presence: 0,
		cinder: -2,
	},
	cinders: [
		"The Burden — What is without name still yearns to be remembered.",
		"The Legion’s Shadow — Glory lingers even where names have been buried.",
		"Silence — The tongue tempts the heart toward vanity.",
		"Dust — What is humbled will one day rule the land again.",
		"Victorious Sin — Every triumph bears the seed of the Legion’s fall.",
	],
	relics: [
		{
			title: "Name-Taker",
			text: "<aspect>A long sword of flawless steel</aspect>, its blade etched with names from hilt to tip—every life the knight has taken. When drawn, <aspect>the blade hums low, a chorus of quiet voices repeating the names inscribed upon it.</aspect> Some say the sword grows heavier with each name, <aspect>burdened not by guilt, but by identity.</aspect>",
			extraLines: 2,
		},
		{
			title: "Vowplate",
			text: "<aspect>A suit of burnished steel</aspect> without crest or mark, <aspect>every plate engraved on the inside with the oaths of the Nameless Legion.</aspect> They say <aspect>no vow sworn while wearing it can be broken</aspect>—that the gods themselves will intercede if necessary.",
			extraLines: 2,
		},

		{
			title: "The Banner of the Nameless Legion",
			text: "A length of pale cloth that has never borne sigil or bright color. Once, <aspect>it led a thousand knights who refused to march beneath any emblem.</aspect> In its blankness they found purity; in its emptiness, pride. When unfurled, <aspect>the air grows still and the world seems to hold its breath.</aspect> On the battlefield, it was said that <aspect>its nothingness was so profound, even the Old Fire dimmed when the banner was raised.</aspect>",
			extraLines: 2,
		},
	],
	oldFire: [
		"Narrate a flashback to the time of the Old Fire, to the day you joined the Nameless Legion. What name did you surrender, and what did you believe you were giving it up for?",
		"Narrate a flashback to a great victory won in the name of humility. What beauty or wonder of the Old Fire did you see then, untouched by ruin?",
		"Narrate a flashback to the moment the Legion began to be honored—when the nameless were spoken of by name. How did pride first creep into the ranks, and what form did it take?",
		"Narrate a flashback to a celebration in the Legion’s hall after a triumph. What act of vanity or excess went unnoticed, or was quietly forgiven?",
		"Narrate a flashback to the day the Legion defied a vow. Who gave the order, and how did you justify obeying it?",
		"Describe the omen, vision, or horror that marked the world’s unraveling. Where were you when the light began to fade, and what did you refuse to see?",
		"Describe the form of the Dimning, and what it was like when it claimed the Legion. What was your final thought before the fire went out—and what ember of it still burns in you now?",
	],
	fireToCome: {
		"The Kindling Gate":
			"Pick a Cinder (do not mark it if it is unmarked) and cross out all others; tell the other Embers they cannot mark The Kindling Gate on their own sheets. Take the Condition: Herald of [Name of Cinder]. Whenever you act in accordance with—or are negatively affected by—the Condition, mark a box below your Cinders. When all the boxes are marked, you can unmark them to unmark the Cinder. The Herald Condition cannot be cleared in the normal ways, but you can choose to clear it in order to get an automatic 12+ on a roll. If you do this, cross out The Kindling Gate.",
		"The Tinder Arch":
			"Name three members of the Legion, and tell the Keeper they are now Dangers. What did you do during the time of the Old Fire to earn their ire?.",
		"The Hearth's Fuel":
			"Narrate a scene showing the spectral Legion roaming the land. How do they bring further sorrow or woe to an already blighted place? Why is it important that you release them from their burdens sooner rather than later?",
		"The Ashen Passage":
			"Increase Cinder by 1 (max 3) and decrease another ability of your choice by 1.",
		"The Pyre's Crown":
			"Narrate the moment you turn from the company and walk alone toward the Throne at the heart of the Old Capital. Then, at the end of this play session, read Ascend the Throne.",
	},
	ascendTheThrone: [
		"This is the march’s end.",
		"The Legion has fallen silent behind you. The banners have burned to smoke.",
		"Your name—your new name—waits to be spoken aloud.",
		" ",

		"You climb the black steps of Ambarell, the echo of your boots ringing through empty halls once bright with the Old Fire’s light. You feel each vow carved into your flesh, the weight of every name you ever spoke pressing against your heart.",
		" ",

		"The Throne stands before you—vast, waiting, hollow as a tomb.",
		"When you place your hand upon its arm, the metal is warm, as if remembering you.",
		"Narrate what will happen should you ascend the Throne of the Old King.",
		" ",

		"What becomes of your vows as you sit—do they dissolve like ash, or blaze into new commandments for the world?",
		"When you speak your true name aloud, how does the sound of it remake the sky, the seas, the cities still standing?",
		"Do the spectral ranks of the Nameless Legion rise once more, countless and redeemed, or do they finally kneel and vanish into peace?",
		"What remains of you—a sovereign reborn, a flame rekindled, or only the echo of your own command, spreading like fire through the dark?",
	],
	moves: [
		{
			title: "…That Knowledge May Be Kept…",
			text: [
				"A summoned knight is also a scholar, their armor etched with runes of remembrance. When they assist with the Information Move, in addition to adding 1 to the roll as normal, they reveal an extra Clue, even on a miss.",
			],
		},
		{
			title: "…That Brothers May Stand…",
			text: [
				"Up to three summoned knights will not disappear when named; write their names on the lines below. Hereafter, these named knights will appear during Struggles; you can direct them to assist with action connected to a single die roll during the Struggle (yours or another Ember’s). All must be directed to the same action; add 1 to the roll for each knight. These knights will only be released from their burdens when you ascend the Throne of the Old King.",
			],
			extraLines: 3,
		},
		{
			title: "…That No Foe Shall Pass…",
			text: [
				"You can summon ten members of the Legion who will act as a phalanx against your enemies. Whenever you and any other number of Embers face a deadly encounter that is not a Struggle, you can describe how the phalanx intercedes on your behalf or otherwise gets you to safety. The phalanx can also be used to bypass all die rolls during the first movement of a Struggle; describe how they help the Embers survive the danger. In either case, each knight must be named when the smoke clears and silence returns.",
			],
		},
		{
			title: "…And the Fallen May Rest.”",
			text: [
				"Whenever you Make Camp, any number of summoned knights are actually squires. Each squire serving in this way can do one of the following (your choice; each can be selected more than once):",
				"<li>Mend equipment (unmark a single Aspect)</li>",
				"<li>Tend wounds (clear an additional physical Condition)</li>",
				"<li>Sing a song or recite poetry (clear an additional emotional or spiritual Condition)</li>",
				"Each squire must be named after performing their service. When dawn comes, the squires are gone; only the warmth of their service remains.",
			],
		},
	],
};
