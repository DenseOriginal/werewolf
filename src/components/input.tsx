import { classNames } from "../stdlib/layout";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: Props) => (
	<div className="flex flex-grow">
		<input
			{...props}
			className={classNames(
				'bg-yellow-100 text-black font-bold py-2 px-4 rounded',
				'placeholder:text-gray-600',
				'active:bg-yellow-200 cursor-pointer',
				'focus:outline-2 focus:outline-offset-2 outline-amber-400 focus:outline',
				'border-amber-400 active:border-amber-500 border-2 noisy',
				'min-w-full w-0',
				props.className,
			)}
		/>
	</div>
);
