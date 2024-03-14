import { useSocketContext } from "./../context/SocketContext";
import useConversation from "./../zustand/useConversation";
import { useEffect } from "react";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  // returns online users and their sockets
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    // ? checks if empty
    socket?.on("newMessage", (newMessage) => {
      // remember ... returns all the previous messages
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages([...messages, newMessage]);
    });
    // If the socket unnods it will stop listening for messages, very necessary to add because it multiply the sound notification to all the listeners u have open and play them
    // its basically so we dont listen to the event more than once
    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};

export default useListenMessages;
