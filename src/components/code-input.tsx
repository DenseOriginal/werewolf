import { useRef, useState } from "react";
import { classNames } from "../stdlib/layout";

interface Props {
	onInput: (input: string) => void;
}

const codeLength = 5;
export const CodeInput = (props: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const focusInput = () => {
		inputRef.current?.focus();
	}

	const [code, setCode] = useState("");
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.length > codeLength) {
			return;
		}
		setCode(value.toUpperCase());

		if (value.length === codeLength) props.onInput(value.toUpperCase());
	}

	const Number = (props: { idx: number }) => {
		const idx = props.idx;
		const value = code[idx];
		const hasValue = value !== undefined;
		const isFocused = idx === code.length;

		return <div
			className={classNames(
				"bg-yellow-100 p-3 rounded box-content min-w-[1ch] grow grid place-items-center",
				!hasValue && "text-opacity-20",
				"text-gray-950",
				"border-amber-400 border-2 noisy",
				isFocused && `
					group-focus-within:outline-2
					group-focus-within:outline-offset-2
					group-focus-within:outline-amber-400
					group-focus-within:outline
				`
			)}
		>
			{value ?? '0'}
		</div>
	}

	return (
		<div
			onClick={focusInput}
			ref={containerRef}
			className="group"
		>
			<div className="flex justify-between text-3xl gap-2">
				{Array.from({ length: codeLength }, (_, i) => <Number key={i} idx={i} />)}
			</div>
			<input
				className="opacity-0 absolute -top-full"
				type="number"
				onChange={onChange}
				ref={inputRef}
				value={code}
			/>
		</div>
	)
}
