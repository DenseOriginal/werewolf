import { CardId } from "@/services/cards"
import "./card.css";
import { useMemo, useState } from "react";
import { classNames } from "@/stdlib/layout";
import { getCard } from "@/services/cards/list";

interface Props {
	card: CardId;
}

export const Card = (props: Props) => {
	const [isStable, setIsStable] = useState(false);
	const [open, setOpen] = useState(false);
	const card = useMemo(() => getCard(props.card), [props.card]);
	
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
			<div className="back flex flex-col justify-center items-center text-black p-2">
				<h1 className="text-3xl text-center">{card.name}</h1>
				<p className="text-center">{card.description}</p>
				{/* <img src="/src/assets/werewolf.png" alt="" /> */}
			</div>
		</div>
	)
}
