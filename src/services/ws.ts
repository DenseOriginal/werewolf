const target = import.meta.env.PROD ?
	"wss://frosted-garrulous-decision.glitch.me:" :
	`ws://${window.location.hostname}:3000`;

export const getWsClient = () => {
	console.log(target);
	
	const ws = new WebSocket(target);

	ws.onerror = (error) => console.error("WebSocket error", error); 

	return ws;
}