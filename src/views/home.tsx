import { useDispatch } from "@/store"
import { Button } from "../components/button"
import { CodeInput } from "../components/code-input"
import { Hr } from "../components/hr"
import { hostGame } from "@/store/host/thunks"
import { useCallback } from "react"
import { useNavigate } from "react-router"

export const HomeView = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const host = useCallback(() => {
		dispatch(hostGame());	
	}, [dispatch]);

	const connectToGame = useCallback((pin: string) => {
		navigate(`/${pin}`);
	}, [])
	
	return <div className="p-3">
		<h1 className="text-xl my-8">Werewolf</h1>

		<div className="flex flex-col gap-2 w-full">
			<CodeInput onInput={connectToGame} />
			<Button className="w-full">Join game</Button>
		</div>
		<Hr>OR</Hr>
		<div className="flex gap-2 w-full">
			<Button className="w-full" onClick={host}>Host game</Button>
		</div>
	</div>
}
