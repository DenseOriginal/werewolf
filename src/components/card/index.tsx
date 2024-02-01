import { CardId } from "@/services/cards"
import "./card.css";
import { useState } from "react";
import { classNames } from "@/stdlib/layout";

interface Props {
	card: CardId;
}

export const Card = (props: Props) => {
	const [isStable, setIsStable] = useState(false);
	const [open, setOpen] = useState(false);
	
	return (
		<div
			className={classNames(
				"card",
				isStable ? "card-to-stable" : "card-slide",
				open && "open",
			)}
			onClick={() => {
				setOpen(!open)
				setIsStable(true)
			}}
			role="button"
		>
			<div className="front"></div>
			<div className="back">
				<img src="/src/assets/werewolf.png" alt="" />
			</div>
		</div>
	)
}
