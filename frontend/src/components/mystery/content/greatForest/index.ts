import type { MysteryContent } from "../../types";

export const GreatForestMysteries: MysteryContent[] = [
	{
		title: "The Mouldering Court",
		intro: [
			"You have heard whispers of a place where flowers once grew to overflowing abundance, where the Fae danced beneath lantern-lit bowers, and mortal poets wept to see such beauty. They called it the Rose Court, a garden-realm ruled by Lady Cenduwain—a sovereign of grace, wit, and wonder, whose footsteps created trails of sweet blossoms.",
			"That was before the Dimning. Before the roses blackened and split under the first touch of bloom rot. Before the garden sank into a choking mire of stagnant water and rotting petals.",
			"Before Lady Cenduwain became the thing now known as the Putrescent Queen.",
			"The stories say she sits at the swamp’s heart, attended by the diseased remains of her court. They say her beauty withered to madness, her laughter curdled to a wet, rasping croon. She is too powerful to approach directly, too broken to reason with, and too rooted in sorrow to leave her throne of thorns and muck.",
			"Yet there is one tale—old, uncertain, half-forgotten—that may offer a path. When the Dimning came, Cenduwain did not fall to shadow. She fell to grief. She lost the one she loved, and in that loss her heart unraveled. If the tale is true, then to reach her—to stand close enough to survive her terrible power—you must uncover the truth of that lost love. You must learn who they were, what they looked like, their story… and wear it like a mask to the heart of the swamp.",
		],
		countdownTotal: 3,
		questionsAndOpportunities: [
			{
				question: "What is the nature and story of Lady Cenduwain’s lost love?",
				complexity: 8,
				opportunity:
					"Resolve the Mystery by seeking the heart of the swamp and immediately engaging in a Struggle against the Putrescent Queen.",
			},
		],
		rewards: {
			supplicants: {
				Muck: "Gain one extra Clue on the Information Move when consulting him about matters related to fungus, decay, or the unseen workings of the natural world, even on a miss.",
				Periwinkle:
					"Gain one extra Clue on the Information Move when consulting him about matters of courtly intrigue, beauty, or Fae etiquette, even on a miss.",
			},
			items: [
				"Roseglass locket: A heart-shaped locket of pale rose crystal, warm to the touch. When opened, it <reveals the strongest emotion lingering in a place.> When held over water, it <shows a fleeting image of someone the water remembers.>",
				"Waterproof reed satchel: A satchel woven from the broad reeds of the swamp. It <keeps its contents dry even when submerged.>",
				"Lion Guard cloth: A square of bright-red cloth that <bolsters resolve against fear or hesitation>, and <always draws attention from nearby foes or beasts.>",
				"Brass resonator: A small brass tube <engraved with the sigil of House Aurene>. It <carries your voice clearly across long distances.>",
				"Granny Lew’s tonic kit: A bundle of corked vials wrapped in oilcloth, smelling sharply of herbs and swampwater. Tonics that <cure nausea>, <ease fever>, and <soothe bloom rot>.",
			],
			special: [
				{
					condition:
						"Additionally, if you defeated Chevalier Scarabine, you get both of the following (Embers decide who gets to add them to Equipment). These can be claimed at any time after the mystery is resolved:",
					rewards: [
						"Beetle plate: <Glossy, black plate armor>, like a beetle’s carapace.",
						"Scarab blade: A <sword of blackened steel>, decorated with <beetle motifs>.",
					],
				},
			],
		},
	},
	{
		title: "Wightwood",
		intro: [
			"When the Old Fire was merely a spark and a single red moon hung in the sky, the earliest tribes of men made war with each other in petty attempts at carving their own settlements out of the wilderness. As a second moon appeared in the sky, a grove of strange trees emerged in place of one of the many battlefields scarring the land. Where once there were blood-stained acres littered with hundreds of unburied infantrymen, there now stood towering white birches. In the Age of Plenty, this place came to be known as the Wightwood—a memorial to the fallen, and a reminder of the sacrifices that helped make the Age possible.",
			"As the Dimming’s shadow snuffed out the Old Fire, something in the darkness stirred the once-slumbering dead from their rest. Rising without nations to claim, these Undead soldiers learned to exist in a harmony they were denied in life. Though the Dimning’s shadow retreated and left the Lands in disarray, things remained tranquil in the Wightwood—for a time.",
			"The Undead now speak of a strange lodge that recently appeared out of nowhere, floating high above the treetops. Visible only at night, the lodge’s design suggests the arrival of a race of beings called Lumenians, not seen since before the Dimning, and bears the crest of their celestial hunting party, the Silvercut Company. More curious though is the motive for their return: in recent years, they have snatched up several of the Undead to bring back to their lodge.",
			"Though the Lumenians have not been seen since before the Dimning, bits of their folklore have remained. Their stories tell of a sleeping beast, the Lumen Prince, whose dreams guide the very orbit of the blue moon. The forthcoming eclipse portents the waking of the prince, whose temperament could leave not only the Lands, but the very cosmos, in ruins. With the eclipse drawing ever closer, and the Silvercut Company still on the hunt, the window to find the means to lull the prince shrinks.",
		],
		questionsAndOpportunities: [
			{
				question: "How can the Silvercut Lodge be accessed?",
				complexity: 2,
				opportunity:
					"Gain access to the Silvercut Lodge and the Locations therein, an unlock the next Question.",
			},
			{
				question:
					"What does the Silvercut Company need from the Undead to keep the Restless Lumen Prince asleep?",
				complexity: 6,
				opportunity:
					"Resolve the Mystery by immediately engaging in a Struggle to perform a ritual to put the Restless Lumen Prince back to sleep.",
			},
		],
		rewards: {
			supplicants: {
				"Scrutineer Kheiro":
					"Gain one extra Clue on the Information Move when consulting him about matters related to Lumenian culture, the physiology of beasts, or the cosmos, even on a miss.",
				Raenya:
					"Gain one extra Clue on the Information Move when consulting them about matters related to nocturnal navigation, hunting, or trapping, even on a miss.",
			},
			items: [
				"Lumenglider boots: Leather hunting boots that allow the wearer to <walk on crescent-shaped plates of rigid moonlight.>",
				"Darkstar hunting bow: <The wielder is able to see perfectly in total darkness> when the bowstring is fully drawn.",
				"Twin-moon astrolabe: This handheld device tracks the paths of the twin moons, and how their movement effects <the constellations in the skies> and <the waters of the Lands.>",
				"Flask of wightsap: When ingested in small doses, this blood-red sap <can impart a tranquil euphoria>, though <too much can lead to madness or catatonia.>",
				"Wightwood buckler: A small round shield reinforced with wightwood branches provides <special protection against fire.>",
			],
		},
		countdownTotal: 5,
	},
];
