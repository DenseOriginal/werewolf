import { PropsWithChildren } from "react";
import { classNames } from "../stdlib/layout";

interface Props {
	className?: string;
}

export const Hr = (props: PropsWithChildren<Props>) => (
	<div
		className={classNames(
			'flex gap-2 justify-center items-center w-full',
			props.className
		)}
	>
		<div className="basis-1/2 shrink h-0.5 bg-white noisy"></div>
		{props.children}
		<div className="basis-1/2 shrink h-0.5 bg-white noisy"></div>
	</div>
)
