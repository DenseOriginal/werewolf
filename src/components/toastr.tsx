import { Toastr, ToastrItem } from "@/services/toastr";
import { classNames } from "@/stdlib/layout";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom"

export const ToastrContainer = () => {
	return createPortal(<ToastrImpl />, document.body);
}

const ToastrImpl = () => {
	const [queue, setQueue] = useState<ToastrItem[]>([]);
	useEffect(() => {
		Toastr.instance.setListener(setQueue);
	}, []);

	return (
		<div className="absolute bottom-2 left-2 right-2 flex flex-col justify-end items-stretch gap-2">
			{queue?.map((item) => <Item key={item.id} {...item} />)}
		</div>
	)
}

const getBgColor = (type: ToastrItem['type']) => {
	switch (type) {
		case 'error': return 'bg-red-600';
		case 'info': return 'bg-blue-600';
	}
}

const Item = (props: ToastrItem) => {
	return (
		<div
			className={classNames(
				'bg-opacity-60 rounded-lg shadow-lg p-4 flex flex-col transition-all',
				getBgColor(props.type),
			)}
		>
			<span>{props.title}</span>
			<span>{props.message}</span>
		</div>
	)
}
