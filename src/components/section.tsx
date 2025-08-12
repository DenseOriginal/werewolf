import { HTMLProps, PropsWithChildren, useCallback, useState } from "react";
import { Hr } from "./hr";
import { classNames } from "@/stdlib/layout";

interface Props extends HTMLProps<HTMLDetailsElement> {
	title: string;
	defaultOpen?: boolean;
}

export const Section = (props: PropsWithChildren<Props>) => {
	const { title, defaultOpen, ...rest } = props;
	const [open, setOpen] = useState(props.defaultOpen || false);
	const toggle = useCallback(() => setOpen(o => !o), [setOpen]);

	return (
		<details {...(props.defaultOpen ? { open: true } : {})} {...rest}>
			<summary onClick={toggle} className="flex justify-between items-center cursor-pointer">
				<Hr leftAligned><p className="text-lg">{props.title}</p></Hr>
				<i className={classNames(
					"fa-solid fa-chevron-right",
					open && "fa-rotate-90",
					"transition-all",
					"text-base text-white text-center",
					"ml-4 mr-2",
				)}></i>
			</summary>
			{props.children}
		</details>
	)
	
	
}