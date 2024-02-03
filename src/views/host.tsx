import { Button } from "@/components/button";
import { Hr } from "@/components/hr";
import Spinner from "@/components/spinner";
import { HostService } from "@/services/host";
import { useSelector } from "@/store"

export const HostView = () => {
	const { gamePin, users, loading } = useSelector(state => ({
		gamePin: state.host.gamePin,
		users: state.host.users,
		loading: state.host.loading
	}));

	return !loading ? (
		<div className="flex flex-col items-center h-full w-full">
			<h1 className="text-xl">Game pin: {gamePin}</h1>

			<div className="mt-5 w-full">
				<Hr leftAligned><p className="text-lg">Users</p></Hr>
				<ul>
					{users.map(user => (
						<li key={user.userId} className="flex items-center gap-3">
							<span>{user.userId}</span>
							{!user.active && <i className="fa-solid fa-question text-red-500"></i>}
						</li>
					))}
				</ul>
			</div>

			<Button
				className="w-full mt-auto mb-9"
				onClick={() => HostService.instance.startGame()}
			>Start</Button>
		</div>
	) : <LoadingView />
}

const LoadingView = () => {
	return <div className="flex flex-col items-center justify-center gap-4 h-full">
		<Spinner size="xl" />
		<h1 className="text-xl">Creating room...</h1>
	</div>
}
