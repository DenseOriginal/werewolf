import { useMemo } from "react";
import { classNames } from "../stdlib/layout";

interface BaseProps<T = unknown> {
	options: T[];
	onSelect: (option: T) => void;
	getOptionLabel: (option: T) => string;
	getOptionValue: (option: T) => string;
	placeholder?: string;
}

type Props<T = unknown> = BaseProps<T> & Omit<React.InputHTMLAttributes<HTMLSelectElement>, 'onSelect'>;

export const Select = <T,>(props: Props<T>) => {
	const { options, getOptionLabel, getOptionValue, placeholder, ...rest } = props;

	const internalOptions = useMemo(
		() => options.map(option => ({
			label: getOptionLabel(option),
			value: getOptionValue(option),
			data: option,
		})),
		[options, getOptionLabel, getOptionValue]
	)

	const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		const option = internalOptions.find(option => option.value === value);
		console.log({ value, option, internalOptions });
		
		if (option) {
			props.onSelect(option.data);
		}
	}

	return (
		<div className="flex flex-grow">
			<select
				{...rest}
				className={classNames(
					'bg-yellow-100 text-black font-bold py-1 px-4 rounded',
					'invalid:text-gray-600',
					'active:bg-yellow-200 cursor-pointer',
					'focus:outline-2 focus:outline-offset-2 outline-amber-400 focus:outline',
					'border-amber-400 active:border-amber-500 border-2 noisy',
					'min-w-full w-0',
					props.className,
				)}
				onSelect={(e) => console.error(`Unexpected onSelect event on select element:`, e)}
				onChange={onSelect}
			>
				<option value="" disabled hidden>{placeholder ?? 'Select...'}</option>
				{internalOptions.map(option => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>
		</div>
	)
}
