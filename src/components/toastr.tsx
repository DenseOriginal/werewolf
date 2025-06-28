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
		<div className={classNames(
			'absolute bottom-3 left-3 right-3 flex flex-col justify-end items-stretch gap-2',
			'touch-none pointer-events-none'
		)}>
			{queue?.map((item) => <Item key={item.id} {...item} />)}
		</div>
	)
}

const getBgColor = (type: ToastrItem['type']) => {
	switch (type) {
		case 'error': return classNames('border-red-600 bg-red-500');
		case 'warn': return classNames('border-yellow-600 bg-yellow-500');
		case 'info': return classNames('border-blue-600 bg-blue-500');
	}
}

const Item = (props: ToastrItem) => {
	return (
		<div
			className={classNames(
				'rounded-lg shadow-lg py-2 px-3 border-2 flex flex-col transition-all',
				getBgColor(props.type),
			)}
		>
			<span className={classNames(props.message && "font-bold")}>{props.title}</span>
			{props.message && <span>{props.message}</span>}
		</div>
	)
}
