const users = {};

export default function userHandlers(io, socket) {
	const { roomId, userName } = socket;

	if (!users[roomId]) {
		users[roomId] = [];
	}

	const updateUserList = () => {
		io.to(roomId).emit("user_list:update", users[roomId]);
	}

	socket.on("user:add", async (user) => {
		socket.to(roomId).emit("log", `User ${userName} connected`);
		user.socketId = socket.id;
		users[roomId].push(user);
		updateUserList();
	});

	socket.on("disconnect", () => {
		if(!users[roomId]) return;

		socket.to()
	})
}