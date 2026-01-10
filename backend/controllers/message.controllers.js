import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.user.userId;
    const { receiver } = req.params;
    const { message } = req.body;

    if (!message && !req.file) {
      return res.status(400).json({ message: "Message or image required" });
    }

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Find existing conversation or create new
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    const newMessage = await Message.create({
      sender,
      receiver,
      message: message || "",
      image: image || "",
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Populate sender & receiver
    await newMessage.populate("sender", "name image");
    await newMessage.populate("receiver", "name image");

    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ message: `sendMessage error: ${error.message}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const sender = req.user.userId;
    const { receiver } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate({
      path: "messages",
      populate: [
        { path: "sender", select: "name image" },
        { path: "receiver", select: "name image" },
      ],
    });

    if (!conversation) return res.status(200).json([]);

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("getMessages error:", error);
    return res.status(500).json({ message: `getMessages error: ${error.message}` });
  }
};
