import { useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "../utils/api";

type Message = {
  senderId: number;
  content: string;
};

const Chat = ({ recipientId, senderId }: { recipientId: number; senderId: number }) => {
  const [messages, setMessages] = useState<Message[]>([]); // Specify Message[] as the state type
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      const data = await fetchMessages(recipientId);
      setMessages(data);
    };

    loadMessages();
  }, [recipientId]);

  const handleSend = async () => {
    if (!newMessage) return;
    const sent = await sendMessage(newMessage, recipientId, senderId);
    if (sent) setMessages((prev) => [...prev, sent]); // TypeScript will now infer the correct type
    setNewMessage("");
  };

return (
    <div className="flex flex-col p-4">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <p key={index} className="p-2">
            <strong className="text-black">{msg.senderId === senderId ? "You" : "Them"}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <div className="flex">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>

  );
};

export default Chat;
