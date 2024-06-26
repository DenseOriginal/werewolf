import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const server = createServer((_req, res) => {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({
		data: 'Hello World!',
	}));
});
const wss = new WebSocketServer({ server });

interface WebSocketClient extends WebSocket {
	userId?: string;
	roomId?: string;
}

const rooms: Record<string, WebSocketClient[]> = {};
const roomHostKeys: Record<string, string> = {};

wss.on('connection', (ws: WebSocketClient) => {
	ws.on('message', (message: string) => {
		const data = JSON.parse(message);
		const { type, roomId, userId, content, targetUserId, hostKey } = data;

		console.log(`Message: ${message}`);
		

		switch (type) {
			case 'createRoom':
				if (rooms[roomId]) {
					ws.send(JSON.stringify({ type: 'error', message: 'Room already exists' }))
				}
				rooms[roomId] = [];

				roomHostKeys[roomId] = Math.random().toString(36).substring(2);

				ws.roomId = roomId;
				ws.userId = userId;
				rooms[roomId].push(ws);
				ws.send(JSON.stringify({ type: 'roomCreated', roomId }))
				break;

			case 'rejoinAsHost':
				if (roomHostKeys[roomId] === hostKey) {
					ws.roomId = roomId;
					ws.userId = userId;
					ws.send(JSON.stringify({ type: 'rejoined', users: rooms[roomId].map((client) => client.userId) }));
					rooms[roomId].push(ws);
				} else {
					ws.send(JSON.stringify({ type: 'error', message: 'Invalid host key' }));
				}
				break;

			case 'joinRoom':
				if (rooms[roomId]) {
					ws.roomId = roomId;
					ws.userId = userId;
					rooms[roomId].push(ws);
					broadcastToRoom(roomId, {
						type: 'userJoined',
						userId: ws.userId,
						name: content.name,
					});
				} else {
					ws.send(JSON.stringify({ type: 'unknownRoom' }));
				}
				break;

			case 'sendMessage':
				if (ws.roomId && ws.userId) {
					broadcastToRoom(ws.roomId, {
						type: 'message',
						userId: ws.userId,
						content,
					});
				} else {
					ws.send(JSON.stringify({ type: 'error', message: 'Not in a room or missing user info' }));
				}
				break;
			case 'sendPrivateMessage':
				if (ws.roomId && ws.userId) {

					sendPrivateMessage(ws.roomId, targetUserId, {
						type: 'message',
						userId: ws.userId,
						content,
					});
				} else {
					ws.send(JSON.stringify({ type: 'error', message: 'Not in a room or missing user info' }));
				}
				break;
		}
	});

	ws.on('close', () => {
		console.log('Client disconnected', { userId: ws.userId, roomId: ws.roomId });
		
		if (ws.roomId && ws.userId) {
			rooms[ws.roomId] = rooms[ws.roomId].filter((client) => client !== ws);
			broadcastToRoom(ws.roomId, {
				type: 'userLeft',
				userId: ws.userId,
			});
		}
	});

	ws.on('error', error => console.log('Error', error))
});

function broadcastToRoom(roomId: string, data: { type: string, userId: string | undefined, content?: unknown, users?: string[], name?: string }) {
	const roomClients = rooms[roomId];
	if (roomClients) {
		roomClients.forEach((client) => {
			if (client.userId === data.userId) {
				return;
			}

			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(data));
			}
		});
	}
}

function sendPrivateMessage(roomId: string, userId: string, data: unknown) {
	const roomClients = rooms[roomId];
	const client = roomClients.find((client) => client.userId === userId);
	if (client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data));
		}
	}
}

server.listen(3000, () => {
	console.log('WebSocket server is running on port 3000');
});