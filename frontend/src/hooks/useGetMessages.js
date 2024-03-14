import { useEffect } from "react";
import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`);

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages(data);

        if (data.error) throw new Error(data.error);
      } catch (error) {
        toast.error(`Here getMessages ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation?._id) {
      getMessages();
    }
    // this just rerenders everything if selectedConversation or messages get updated
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
