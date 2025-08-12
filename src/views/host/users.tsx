import { Hr } from "@/components/hr"
import { HostService } from "@/services/host";
import { useSelector } from "@/store"
import { useCallback } from "react";

export const Users = () => {
	const users = useSelector(state => state.host.users);

	const kickPlayer = useCallback((id: string) => {
		HostService.instance.kickPlayer(id);
	}, []);

	return (
		<div className="w-full min-h-16">
			<Hr leftAligned><p className="text-lg">Users</p></Hr>
			<ul>
				{users.map(user => (
					<li key={user.userId} className="flex items-center gap-3 justify-between">
						<span>{user.name}</span>

						<button onClick={() => kickPlayer(user.userId)}>
							<i className="fa-solid fa-xmark"></i>
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}
