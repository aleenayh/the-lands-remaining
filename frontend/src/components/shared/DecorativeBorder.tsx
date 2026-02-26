import { motion } from "framer-motion";
import { usePreferences } from "../../context/PreferencesContext";
import { ReactComponent as BorderIcon } from "../assets/border.svg";

export function DecorativeBorder({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`h-full w-full relative z-0 border-theme-border-accent border-2 p-4 ${className}`}
		>
			{children}
			<div className="absolute inset-0 h-full w-full pointer-events-none -z-[1]">
				<BorderIcon className="text-theme-border-accent absolute top-0 left-0 w-12 h-12 transform rotate-90" />
				<BorderIcon className="text-theme-border-accent absolute bottom-0 right-0 w-12 h-12 transform -rotate-90" />
				<BorderIcon className="text-theme-border-accent absolute top-0 right-0 w-12 h-12 rotate-180" />
				<BorderIcon className="text-theme-border-accent absolute bottom-0 left-0 w-12 h-12 transform " />
			</div>
		</div>
	);
}

export function BorderedTray({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { prefersReducedMotion } = usePreferences();
	return (
		<motion.div
			initial={{
				left: prefersReducedMotion ? 0 : "-100%",
				opacity: prefersReducedMotion ? 0 : 1,
			}}
			animate={{ left: 0, opacity: 1 }}
			exit={{
				left: prefersReducedMotion ? 0 : "-100%",
				opacity: prefersReducedMotion ? 0 : 1,
			}}
			transition={{
				duration: prefersReducedMotion ? 0 : 1,
			}}
			className={`absolute top-0 left-0 w-full md:w-1/2 h-screen flex flex-col justify-start items-center bg-theme-bg-secondary z-10 transition-all ease-linear pointer-events-auto border-theme-border-accent border-2 overflow-y-auto  border-l-0 p-4 ${className}`}
		>
			{children}
			<div className="absolute inset-0 h-full w-full pointer-events-none z-[5]">
				<BorderIcon className="text-theme-border-accent absolute bottom-0 right-0 w-12 h-12 transform -rotate-90" />
				<BorderIcon className="text-theme-border-accent absolute top-0 right-0 w-12 h-12 rotate-180" />
			</div>
		</motion.div>
	);
}
