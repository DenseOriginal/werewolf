import { Hr } from "@/components/hr"
import { useSelector } from "@/store"

export const Users = () => {
	const users = useSelector(state => state.host.users);

	return (
		<div className="w-full min-h-16">
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
	)
}
