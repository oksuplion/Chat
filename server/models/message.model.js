import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema(
	{
		messageId: {
			type: String,
			required: true,
			unique: true,
		},
		roomId: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

export default messageSchema;
