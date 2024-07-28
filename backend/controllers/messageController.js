import Conversation from "../models/chat/conversation.js";
import Message from "../models/chat/message.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";


const sendMessage = asyncHandler(async (req, res) => {
    try {
        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user;
        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]},
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // await conversation.save();
        // await newMessage.save();

        await Promise.all([conversation.save(), newMessage.save()]);


        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
})
const getMessages = asyncHandler(async (req, res) => {
    try {
        const {id: receiverId} = req.params;
        const senderId = req.user;

        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]},
        }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
})

const getConversationOverview = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        const conversations = await Conversation.aggregate([
            {
                // Get all conversations where the user is a participant
                $match: {
                    participants: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                // Lookup to join messages collection and get full details of messages
                $lookup: {
                    from: "messages",
                    localField: "messages",
                    foreignField: "_id",
                    as: "messageDetails",
                },
            },
            {
                // Unwind the message details array to handle each message individually
                $unwind: {
                    path: "$messageDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // Sort messages in each conversation by creation time in descending order
                $sort: {
                    "messageDetails.createdAt": -1,
                },
            },
            {
                // Group back to conversations and keep only the last message
                $group: {
                    _id: "$_id",
                    participants: { $first: "$participants" },
                    lastMessage: { $first: "$messageDetails" },
                },
            },
            {
                // Project the needed fields and exclude the current user from participants
                $project: {
                    _id: 1,
                    participants: {
                        $filter: {
                            input: "$participants",
                            as: "participant",
                            cond: { $ne: ["$$participant", new mongoose.Types.ObjectId(userId)] },
                        },
                    },
                    lastMessage: 1,
                },
            },
            {
                // Lookup to get details about the other participant
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participantDetails",
                },
            },
            {
                // Unwind the participant details array
                $unwind: "$participantDetails",
            },
            {
                // Project the final shape of the output
                $project: {
                    _id: 1,
                    participant: "$participantDetails",
                    lastMessage: 1,
                },
            },
        ]);

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default {
    sendMessage,
    getMessages,
    getConversationOverview
}