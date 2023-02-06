import Message from "../../models/message.model.js";
import onError from "../../utils/onError.js";

const messages = {};

export default function messageHandlers(io, socket) {
	const { roomId } = socket;

	const updateMessageList = () => {
		io.to(roomId).emit("message_list:update", messages[roomId]);
	}

	socket.on("message:get", async () => {
		try {
			const _messages = await Message.find({ roomId });
			messages[roomId] = _messages;
			updateMessageList();
		} catch (err) {
			onError(err);
		}
	});

	socket.on("message:add", (message) => {
		Message.create(message).catch(onError);
		message.createdAt = Date.now();
		messages[roomId].push(message);
		updateMessageList();
	});
	
}