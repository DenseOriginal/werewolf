import { HomeView } from "@/views/home";
import { HostView } from "@/views/host";
import { PlayerView } from "@/views/player";
import {
	createBrowserRouter
} from "react-router";

export const router = createBrowserRouter([
	{ path: "/", element: <HomeView /> },
	{ path: "/:roomId/host", element: <HostView /> },
	{ path: "/:roomId", element: <PlayerView /> },
]);