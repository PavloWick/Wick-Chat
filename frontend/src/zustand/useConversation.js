import { create } from "zustand";

// This function is the same as const [selectedConversation, setSelectedConversation] = useState(null);
const useConversation = create((set) => ({
  selectedConversation: null,
  // setSelectedconversation is a function that takes in the parameter selectedConversation and sets it to the object passed
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;
