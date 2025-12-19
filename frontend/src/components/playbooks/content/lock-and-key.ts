import type { PlaybookBase } from "../types";

export const LockAndKey: PlaybookBase = {
	title: "The Lock And Key",
	intro: [
		"You were once a disciple of the Crystal Door, an order of spies, infiltrators, and thieves that taught one truth above all others: your body is both lock and key. A lock that keeps out illness, fatigue, poison, and decay. A key that opens thresholds others can’t even perceive. You mastered your own physiology. You learned to still your pulse to a single beat per hour, flush toxins through sheer willpower, bend joints past their limits, harden muscle to turn aside blades, and guide breath through your body like a thread through a loom. You were a living instrument, tuned to perfection. Then the Dimning came.",

		"You should have died with the rest of them, but the Old Fire hid you—it opened a narrow fold in the world, a breathless pocket between moments, and slipped you inside. And there, your training saved you: you slowed your heart, cooled your blood, sealed your senses, and became your own vault.",

		"Centuries passed, and now you walk again, to Elegy. But unlike the other Embers, you were not reborn. You endured. And you aren’t here to remake the world in your image—your order served thrones, not usurped them. No… you’re here to find the most impossible threshold of all: the one hiding the Dimning itself. And when you finally cross it, the Dimning will be held to account.",
	],
	names: [
		"Arveth",
		"Jorra",
		"Kelvine",
		"Sorell",
		"Tammis",
		"Veylan",
		"Niska",
		"Harven",
		"Lioraen",
		"Merix",
		"Oskael",
		"Triven",
		"Caelis",
		"Fenwyn",
		"Irdel",
		"Rhessa",
		"Malcir",
	],
	honorifics: [
		"Who Slips Between Shadow",
		"Who Walks the Narrow Vein of Night",
		"Who Holds the Pulse of Silence",
		"Who Opens Doors Unseen",
		"Who Moves Like Mist Beneath the Moon",
		"Who Climbs the Seam of Midnight",
		"Who Drinks the Stillness of Stone",
		"Who Leaves No Echo in Passing",
		"Who Bends Where the World Remains Rigid",
		"Who Evades Iron’s Vigil",
		"Who Touches the Knot Beneath All Motion",
		"Who Stands Behind the Unblinking Eye",
		"Who Waits in the Fold Between Moments",
		"Who Drapes Themselves in Silence",
		"Who Shadows the Steps of Fate",
		"Who Knows the Door Beneath All Doors",
		"Who Holds the Shape of Emptiness",
		"Who Sleeps with One Breath Held",
		"Who Threads Their Shadow Through Yours",
		"Who Moves Like Ink in Water",
	],
	look: [
		"lose-cropped hair kept deliberately plain",
		"a smooth, unreadable face with eyes that never quite stay still",
		"a high braid threaded with a single hidden wire",
		"hair pinned back with tools disguised as combs",
		"a soft cloth mask worn loose around the neck, its lining stitched with sigils",
		"a collar that can be pulled up to conceal the mouth in a single motion",
		"a loose linen shirt stitched with nearly invisible escape seams",
		"a long coat cut close to the body, whisper-light despite its many layers",
		"a fitted vest with buttons that unscrew into tiny tools",
		"gloves of fine leather, the fingertips subtly reinforced",
		"a belt with knots tied in a pattern known only to the Crystal Door",
		"a cord-wrapped satchel with false bottoms and hidden slits",
		"a short-sleeved jerkin with flexible armored plates sewn in",
		"trousers tailored for freedom of movement, hems weighted to fall silently",
		"loose sleeves gathered at the wrist to hide swift hand motions",
		"a simple sash that unravels into several yards of climbing cord",
		"soft boots with layered soles designed to muffle each step",
		"travel-worn leggings reinforced at the knees for sudden climbs",
		"boots scuffed smooth at the toes from climbing stone",
		"ankle wraps wound tight, with tiny lockpicks hidden between the layers",
	],
	rituals: [
		"The Empty Breath",
		"The Threefold Unbinding",
		"The Knotted Pulse",
		"The Watcher’s Stillness",
		"The Door Beneath the Skin",
	],
	questions: [
		"Did you slip past an enemy when fighting them was an option?",
		"Did you fight an enemy when slipping past them was an option?",
		"Did you deliver an embittered monologue about the Dimning?",
		"Did you demonstrate your amazing physical talents to someone else’s wonder and astonishment?",
		"Did you relate a situation to the story of the mouse in the tower?",
	],
	abilities: {
		vitality: 1,
		composure: 2,
		reason: 0,
		presence: 0,
		cinder: -2,
	},
	cinders: [
		"The Tower’s Lesson — Even the unscalable falls to the small and certain.",
		"The Cat’s Stillness — Patience breaks any foe.",
		"The Serpent’s Breath — Every danger has a silent moment.",
		"The Crow’s Sight — I see paths others miss.",
		"The Kindly Old Man — He who is unseen can still see.",
	],
	relics: [
		{
			title: "Burgular's Tools",
			text: "A bundle of tools in <aspect>a waterproof roll</aspect>, including <aspect>tar paper</aspect>, <aspect>a file & lockpicks</aspect>, and <aspect>a small mirror on an extendible handle</aspect>. ",
			extraLines: 2,
		},
		{
			title: "Traveling Cloak",
			text: "A sturdy cloak with <aspect>a matte coating that drinks light</aspect>. The interior side is lined with <aspect>dozens of small pockets for hiding things</aspect>. Many of these pockets contain <aspect>small, helpful—and sometimes unusual—trinkets</aspect>.",
			extraLines: 2,
		},
		{
			title: "Quick Change Kit",
			text: "An outfit that <aspect>can be quickly modified to one of several halfway decent disguises</aspect>. The kit includes <aspect>stage make-up</aspect> and <aspect>prosthetic clay</aspect>.",
			extraLines: 2,
		},
	],
	oldFire: [
		"Narrate a flashback to your greatest triumph as a member of the Crystal Door. What impossible threshold did you cross, and how did your mastery of the body make you the quiet legend of your order?",
		"Narrate a flashback to the moment you first sensed the Dimning on the horizon. What form did the Dimning take for you?",
		"Narrate a flashback to when you saved someone from the Dimning’s first advance. Who were they, and what split-second choice did you make that pulled them back from the brink?",
		"Narrate a flashback to your time on the run with the person you saved. What skills kept you both alive, and what did you learn about each other while slipping from shadow to shadow?",
		"Narrate a flashback to the moment you realized you had fallen in love with the person you saved. What small, quiet gesture revealed what your discipline had tried to hide?",
		"Narrate a flashback to the moment you could no longer save the person you loved. How did the Dimning take them from you, and what promise—kept or broken—lingered between you at the end?",
		"Narrate a flashback showing how the Old Fire helped you disappear into the fold between moments. How did you surrender yourself to stillness, and what part of you was left behind when you hid from the Dimning’s reach?",
	],
	fireToCome: {
		"The Kindling Gate":
			"Pick a Cinder (do not mark it if it is unmarked) and cross out all others; tell the other Embers they cannot mark The Kindling Gate on their own sheets. Take the Condition: Herald of [Name of Cinder]. Whenever you act in accordance with—or are negatively affected by—the Condition, mark a box below your Cinders. When all the boxes are marked, you can unmark them to unmark the Cinder. The Herald Condition cannot be cleared in the normal ways, but you can choose to clear it in order to get an automatic 12+ on a roll. If you do this, cross out The Kindling Gate.",
		"The Tinder Arch":
			"Tell the Keeper they can force you—and only you—into a Struggle with the Dimgaunt at any time as a reaction.",
		"The Hearth's Fuel":
			"Hereafter, Side Character Embers will always try to get you to come with them to the Old Capital, so you can help them get past its barriers. If you ever accept, read Ascend the Throne at the end of the play session and retire this character. If you refuse, roll the Light Move.",
		"The Ashen Passage":
			"Increase Cinder by 1 (max 3) and decrease another ability of your choice by 1.",
		"The Pyre's Crown":
			"Narrate the moment you turn from the company and walk alone toward the Throne at the heart of the Old Capital. Then, at the end of this play session, read Ascend the Throne.",
	},
	ascendTheThrone: [
		"The Old Capital rises before you like the memory of a forgotten god—towering, silent, half-eaten by shadow. Its walls shimmer with ancient wards, runes spiraling upward in impossible geometries that hurt to look at. Bridges twist through the air like strands of glass. Gates lock themselves without being touched. Arrows of frozen lightning hang in the sky, waiting to strike you down.",

		"You move closer. Every step reveals a new cruelty of its design. Murder-holes that open like blinking eyes. Staircases that fold in upon themselves. Watchtowers that shift position when unobserved. Even the ground beneath your feet changes its inclination, trying to usher you back down the path you climbed.",

		"<strong>And yet… what flaw—small, strange, or subtle—do you perceive in the Old Capital’s defenses? This information is a Key to the Old Capital.</strong> ",

		"You rest your hand upon the impossible gate. You feel its sigils hum beneath your palm. And then, without ceremony, you step away from it. The Old Capital watches you go—its lights dimming, its shifting walls settling like a beast denied its meal. You do not look back. You walk past the fallen statues, the hollow streets, the ghost-ridden courts.",

		"You are not here to rule. You are here to hunt. ",

		"<strong>As you vanish into the world to face the Dimning itself, what final vow—spoken or unspoken—guides you?</strong>",
	],
	moves: [
		{
			title: "…Whose Walls Recall Wind…",
			text: [
				"You have near-superhuman dexterity and climbing ability. When you take this move, narrate a flashback showing a montage of your Crystal Door training. What impossible heights did you learn to scale? What precarious paths did you manage to navigate?",
				"For you, climbing sheer surfaces; quickly navigating up, down, or through; keeping your balance in treacherous situations; and other feats of acrobatics don’t trigger the Light/Dark Move. If you’re also under fire in such a situation, you never roll worse than the Light Move.",
			],
		},
		{
			title: "…And Where Fire and Frost Break.",
			text: [
				"Your mastery of your body allows you to more easily survive both extreme heat and extreme cold. When you take this move, narrate a flashback showing a montage of your Crystal Door training. How did your mentors know you could survive in the frozen North without shelter? How did they know your body was a lock against heat?",
				"Heat that would cause a normal person to pass out, and cold that would slow another’s heart, have no effect on you. If you’re subjected to heat that would damage the skin, such as fire, or cold that would cause frostbite, such as being caught in a blizzard, you never roll worse than the Light Move.",
			],
		},
		{
			title: "All Are Turned Without…",
			text: [
				"You are able to expel sickness and toxins from your body. When you take this move, narrate a flashback showing a montage of your Crystal Door training. What tests did you endure that would have instantly—or extremely slowly—killed someone else?",
				"When you attempt to resist disease, poison, venom, and other toxins, any associated rolls are taken with advantage. When you Make Camp, you immediately clear any Conditions connected to such.",
			],
		},
		{
			title: "…But the Meek, Who Walk Freely.",
			text: [
				"You can make yourself preternaturally small, flat, and/or quiet in order to avoid detection. When you take this move, narrate a flashback showing a montage of your Crystal Door training. What seemingly-impregnable place did you have to infiltrate as part of your final test?",
				"So long as there is a shadow or space at least half the thickness of your body, or ¼ your height, you can hide in it. People with normal senses will not find you, period. When hiding from animals, monsters, or humanoid creatures with supernatural senses, you never roll worse than the Light Move.",
			],
		},
	],
};
