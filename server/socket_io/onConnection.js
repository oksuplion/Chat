io.on("connection", (socket) => {
	socket.on("join", ({ name, room }) => {
		socket.join(room);

		const { user, isExist } = addUser({ name, room });

		const userMessage = isExist ? `${user.name}, here you go again ` : `Hey ${user.name}`;

		socket.emit("message", {
			data: { user: { name: "Admin" }, message: userMessage },
		});

		socket.broadcast.to(user.room).emit("message", {
			data: { user: { name: "Admin" }, message: `${user.name} has join` },
		});

		io.to(user.room).emit("room", {
			data: { users: getRoomUsers(user.room) }
		});
	});

	socket.on("sendMessage", ({ message, params }) => {
		const user = findUser(params);

		if (user) {
			io.to(user.room).emit("message", { data: { user, message } });
		}
	})

	socket.on("leftRoom", ({ params }) => {
		const user = removeUser(params);

		if (user) {
			const { room, name } = user;
			io.to(room).emit("message", {
				data: { user: { name: "Admin" }, message: `${name} has left` },
			});

			io.to(user.room).emit("room", {
				data: { users: getRoomUsers(room) }
			});
		}
	});

	io.on("disconnect", () => {
		console.log("Disconnect");
	})
});
