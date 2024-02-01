import { PropsWithChildren } from "react";
import { classNames } from "../stdlib/layout";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: PropsWithChildren<Props>) => (
	<button
		{...props}
		className={classNames(
			'bg-yellow-100 text-black font-bold py-2 px-4 rounded',
			'active:bg-yellow-200 cursor-pointer',
			'focus:outline-2 focus:outline-offset-2 outline-amber-400 focus:outline',
			'border-amber-400 active:border-amber-500 border-2 noisy',
			props.className,
		)}
	>{children}</button>
);
