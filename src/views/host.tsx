import { Button } from "@/components/button";
import { HostService } from "@/services/host";
import { useSelector } from "@/store"

export const HostView = () => {
	const { gamePin, users } = useSelector(state => ({
		gamePin: state.host.gamePin,
		users: state.host.users
	}));

	return <div className="flex flex-col items-center mt-28 h-full">
		<h1 className="text-xl">{gamePin}</h1>
		<Button
			className="w-full"
			onClick={() => HostService.instance.startGame()}
		>Start</Button>

		<div className="mt-5">
			<p className="text-l">Users</p>
			<ul>
				{users.map(user => <li key={user}>{user}</li>)}
			</ul>
		</div>
	</div>
}