import {Schema, model} from "mongoose";

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        // createdAt, updatedAt => message.createdAt in the frontend
    },
    {timestamps: true}
);

const Message = model("Message", messageSchema);

export default Message;
