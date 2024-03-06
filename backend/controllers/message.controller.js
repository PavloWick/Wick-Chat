import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

export const sendMessage = async (req,res) => {
    // name is 'id' because thats what we set it to in our router
    // process.stdout.write(req.params.id);

    try{
        const {message} = req.body;
        const senderId = req.user._id;
        // same as const id = req.params.id, also renaming it to recieverId
        const {id: recieverId} = req.params;

        // tries to find conversation between the two users
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        });

        // if doesent exist we create one
        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId],
            })
        }

        // Creates the sent message
        const newMessage = new Message({
            senderId,
            recieverId,
            message
        });

        // Pushes the sent message into the array
        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        
        // Runs in parallel and saves convo + message to db
        await Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json(newMessage);

    } catch(error) {
        process.stdout.write("Error in sendMessage controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }

};

export const getMessage = async (req,res) => {
    try{

        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId]},
        }).populate("messages");

        res.status(200).json(conversation.messages);

    }catch(error) {
        process.stdout.write("Error in getMessage controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}