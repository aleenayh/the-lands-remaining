import { motion } from "framer-motion";
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
	return (
		<motion.div
			initial={{ left: "-100%" }}
			animate={{ left: 0 }}
			exit={{ left: "-100%" }}
			transition={{ duration: 1 }}
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
