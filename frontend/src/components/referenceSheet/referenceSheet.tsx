import { AnimatePresence, motion } from "framer-motion";
import { Section } from "../playbooks/sharedComponents/Section";
import { ReactComponent as BookIcon } from "./book.svg";

export function ReferenceSheet({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	return (
		<div className="flex flex-col justify-start items-start h-full w-full pointer-events-none">
			<button
				type="button"
				className="w-10 h-10 text-theme-accent-primary bg-theme-bg-secondary rounded-none rounded-br-lg p-2 hover:bg-theme-bg-accent hover:text-theme-text-accent transition-colors pointer-events-auto"
				onClick={() => setIsOpen(!isOpen)}
			>
				<BookIcon className="w-full h-full" />
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ left: "-100%" }}
						animate={{ left: 0 }}
						exit={{ left: "-100%" }}
						transition={{ duration: 1 }}
						className="absolute top-0 left-0 w-full md:w-1/2 h-screen flex flex-col justify-start items-center bg-theme-bg-secondary border-r border-theme-border-accent rounded-lg p-4 z-10 transition-all ease-linear overflow-y-auto pointer-events-auto"
					>
						<button
							type="button"
							className="absolute top-0 right-0 w-8 h-8"
							onClick={() => setIsOpen(!isOpen)}
						>
							X
						</button>
						<h1 className="text-2xl font-bold text-theme-text-accent">
							Reference Sheet
						</h1>
						<div className="flex flex-col justify-stretch items-start text-left">
							<Section title="The Light Move" collapsible={true}>
								<p>
									When you do something risky or face something you fear, name
									what you’re afraid will happen if you fail or lose your nerve,
									then roll with an appropriate ability.
								</p>
								<ul className="list-disc list-inside text-sm">
									<li>
										On a 7-9, the Keeper will tell you how your actions would
										leave you vulnerable, and you can choose to back down or go
										through with it. If you go through with it, the Keeper
										describes what it looks like.
									</li>
									<li>
										On a 10+, you do what you intended or you hold steady;
										describe what it looks like.
									</li>
									<li>
										On a 12+, you do what you intended or you hold steady, and
										the Keeper will tell you some extra benefit or advantage you
										receive. Describe what it looks like.
									</li>
								</ul>
							</Section>
							<Section title="The Dark Move" collapsible={true}>
								<p>
									When you do something risky or face something you fear, name
									what you’re afraid will happen if you fail or lose your nerve.
									The Keeper will tell you how it is worse than that. You can
									choose to back down or go through with it. If you go through
									with it, roll with an appropriate ability.
								</p>
								<ul className="list-disc list-inside text-sm">
									<li>
										On a 10+, you do what you intended or you hold steady;
										describe what it looks like.
									</li>
									<li>
										On a 7-9, you do it or hold steady, but there is a
										complication or cost; the Keeper describes what it looks
										like.
									</li>
								</ul>
							</Section>
							<Section title="The Information Move" collapsible={true}>
								<p>
									When you explore the environment, question others, or
									otherwise gather information, describe how you’re doing so and
									roll with an appropriate ability. *On a hit, you find a Clue.
									The Keeper will tell you what it is.
								</p>
								<ul className="list-disc list-inside text-sm">
									<li>
										On a hit, you find a Clue. The Keeper will tell you what it
										is.
									</li>
									<li>
										On a 7-9, there’s a complication—either with the Clue
										itself, or a complication you encounter while searching. The
										Keeper will tell you what the complication is.
									</li>
									<li>On a 12+, you also find a Lord Clue.</li>
								</ul>
							</Section>
							<Section title="Answer a Question" collapsible={true}>
								<p>
									When the Embers have an open, freewheeling discussion about
									the answer to a Question once they have gathered a number of
									Clues equal to at least half the Question’s Complexity—and
									reach a consensus—roll plus the number of Clues incorporated
									into the answer or otherwise explained away, minus the
									question’s Complexity.
								</p>
								<ul className="list-disc list-inside text-sm">
									<li>
										On a 10+, the answer is correct and an Opportunity can be
										pursued.
									</li>
									<li>
										On a 7-9, as above, but the Keeper will add an unwelcome
										complication to the answer and/or pursuing the Opportunity
										will be more dangerous.
									</li>
									<li>
										On a 6-, the answer is incorrect and the Keeper reacts.
									</li>
								</ul>
								<p className="italic text-sm">
									Note: The Answer a Question roll can never be taken with
									advantage or disadvantage. The success tier can be increased
									by one Ember marking Cinder; the Ember must reinterpret the
									answer to the Question through the lens of the Cinder.
								</p>
							</Section>
							<Section title="Make Camp" collapsible={true}>
								<p>
									When you and any other number of Embers settle down to rest,
									you can tell a pleasant story from the time of the Old Fire or
									engage in your Ritual. If you do, clear an appropriate
									Condition or unmark an appropriate Aspect. Then, as a group,
									you discover a Clue for an active Mystery; tell the Keeper
									what it is. The Clue cannot conclusively answer a Question by
									itself.
								</p>

								<p>
									If you are in a dangerous place, the Keeper will ask one of
									you what you’re afraid could happen if you let your guard
									down. After the Ember speaks, the Keeper will ask the same
									question of another Ember; that Ember must say something
									different, or build on the answer of the first Ember. The
									Keeper will do this until all Embers have had a chance to
									answer, either by saying something new or building on the
									answer of another Ember. The Keeper will then say how it is
									worse than all that. Then, the Ember with the lowest Cinder
									(or whoever the Keeper wishes in the case of a tie) rolls with
									Cinder.
								</p>
								<ul className="list-disc list-inside text-sm">
									<li>On a 10+, the rest period passes without incident.</li>
									<li>
										On a 7-9, the rest period passes without incident, but your
										campsite attracts unwanted attention; someone or something
										will be following you.
									</li>
									<li>On a miss, the worst comes to pass.</li>
								</ul>
							</Section>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
