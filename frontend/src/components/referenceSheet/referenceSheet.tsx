import { AnimatePresence } from "framer-motion";
import { Tooltip } from "radix-ui";
import { useState } from "react";
import { ReactComponent as Logo } from "../assets/tlr-logo.svg";
import { CloseTrayButton } from "../shared/CloseTrayButton";
import { BorderedTray } from "../shared/DecorativeBorder";
import { Divider } from "../shared/Divider";
import { ControlledSection } from "../shared/Section";
import { StyledTooltip } from "../shared/Tooltip";
import { ReactComponent as BookIcon } from "./book.svg";

export function ReferenceSheet({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	const [lightCollapsed, setLightCollapsed] = useState(false);
	const [darkCollapsed, setDarkCollapsed] = useState(false);
	const [informationCollapsed, setInformationCollapsed] = useState(false);
	const [questionCollapsed, setQuestionCollapsed] = useState(false);
	const [campCollapsed, setCampCollapsed] = useState(false);

	return (
		<div className="flex flex-col justify-start items-start h-full w-full pointer-events-none">
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						aria-label="Open rules reference"
						className="drawerButton"
						onClick={() => setIsOpen(!isOpen)}
					>
						<BookIcon className="w-full h-full" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content className="z-30 pl-1" side="right">
						<StyledTooltip>Rules Reference</StyledTooltip>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
			<AnimatePresence>
				{isOpen && (
					<BorderedTray>
						<CloseTrayButton close={() => setIsOpen(!isOpen)} />
						<div className="sticky flex flex-col justify-start items-center pointer-events-none">
							<Logo className="w-1/3 h-auto mx-auto mb-4" />
							<h1 className="text-2xl font-bold text-theme-text-accent">
								Reference Sheet
							</h1>
						</div>
						<div className="flex flex-col justify-stretch items-start text-left overflow-y-auto gap-0">
							<ControlledSection
								title="The Light Move"
								collapsible
								leftAlign
								withDecoration
								isCollapsed={lightCollapsed}
								setIsCollapsed={setLightCollapsed}
							>
								<p>
									When you do something risky or face something you fear, name
									what you’re afraid will happen if you fail or lose your nerve,
									then roll with an appropriate ability.
								</p>
								<ul className="list-disc list-inside text-sm ml-6">
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
							</ControlledSection>
							<Divider />
							<ControlledSection
								title="The Dark Move"
								collapsible
								leftAlign
								withDecoration
								isCollapsed={darkCollapsed}
								setIsCollapsed={setDarkCollapsed}
							>
								<p>
									When you do something risky or face something you fear, name
									what you’re afraid will happen if you fail or lose your nerve.
									The Keeper will tell you how it is worse than that. You can
									choose to back down or go through with it. If you go through
									with it, roll with an appropriate ability.
								</p>
								<ul className="list-disc list-inside text-sm ml-6">
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
							</ControlledSection>
							<Divider />
							<ControlledSection
								title="The Information Move"
								collapsible
								leftAlign
								withDecoration
								isCollapsed={informationCollapsed}
								setIsCollapsed={setInformationCollapsed}
							>
								<p>
									When you explore the environment, question others, or
									otherwise gather information, describe how you’re doing so and
									roll with an appropriate ability.
								</p>
								<ul className="list-disc list-inside text-sm ml-6">
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
							</ControlledSection>
							<Divider />
							<ControlledSection
								title="Answer a Question"
								collapsible
								leftAlign
								withDecoration
								isCollapsed={questionCollapsed}
								setIsCollapsed={setQuestionCollapsed}
							>
								<p>
									When the Embers have an open, freewheeling discussion about
									the answer to a Question once they have gathered a number of
									Clues equal to at least half the Question’s Complexity—and
									reach a consensus—roll plus the number of Clues incorporated
									into the answer or otherwise explained away, minus the
									question’s Complexity.
								</p>
								<ul className="list-disc list-inside text-sm ml-6">
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
							</ControlledSection>
							<Divider />
							<ControlledSection
								title="Make Camp"
								collapsible
								leftAlign
								withDecoration
								isCollapsed={campCollapsed}
								setIsCollapsed={setCampCollapsed}
							>
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
								<ul className="list-disc list-inside text-sm ml-6">
									<li>On a 10+, the rest period passes without incident.</li>
									<li>
										On a 7-9, the rest period passes without incident, but your
										campsite attracts unwanted attention; someone or something
										will be following you.
									</li>
									<li>On a miss, the worst comes to pass.</li>
								</ul>
							</ControlledSection>
						</div>
					</BorderedTray>
				)}
			</AnimatePresence>
		</div>
	);
}
