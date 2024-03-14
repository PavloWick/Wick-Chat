import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  // name is 'id' because thats what we set it to in our router
  // process.stdout.write(req.params.id);

  try {
    const { message } = req.body;
    const senderId = req.user._id;
    // same as const id = req.params.id, also renaming it to recieverId
    const { id: recieverId } = req.params;

    // tries to find conversation between the two users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    // if doesent exist we create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    // Creates the sent message
    const newMessage = new Message({
      senderId,
      recieverId,
      message,
    });

    // Pushes the sent message into the array
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Runs in parallel and saves convo + message to db
    await Promise.all([conversation.save(), newMessage.save()]);

    // sends message to other user when its saved to DB
    const recieverSocketId = getRecieverSocketId(recieverId);
    if (recieverSocketId) {
      // io.to speficifys who to send to, without it emit just sends to all
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    process.stdout.write("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      res.status(200).json([]);
      return;
    }
    const messages = conversation?.messages || [];

    res.status(200).json(messages);
  } catch (error) {
    process.stdout.write("Error in getMessage controller: ", error.message);
    res.status(500).json({
      error: `Internal server error`,
    });
  }
};
