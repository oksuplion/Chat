import cors from "cors";
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { ALLOWED_ORIGIN, MONGODB_URI } from "./config.js";
import route from "./route.js";
import onError from "./utils/onError.js"
import { addUser, findUser, getRoomUsers, removeUser } from "./users.js";

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));
app.use(route);
app.use(onError)

try {
	await mongoose.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	console.log('🚀 Mongo Connected')
} catch (e) {
	onError(e)
}

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {

	const { name, room } = socket.handshake.query;

	
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


server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
