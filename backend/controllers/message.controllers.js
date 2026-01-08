import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.user.userId;
    const { receiver } = req.params;
    const { message } = req.body;

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
      message,
      image,
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

    // Populate sender & receiver for frontend
    await newMessage.populate("sender", "name image");
    await newMessage.populate("receiver", "name image");

    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: `send Message error ${error}` });
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

    if (!conversation) {
      return res.status(200).json([]);
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    return res.status(500).json({ message: `get message error ${error}` });
  }
};
