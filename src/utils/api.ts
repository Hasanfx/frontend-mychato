





export const fetchMessages = async (recipientId: number) => {
    try {
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); // Log the URL to check it

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages?recipientId=${recipientId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return await res.json();
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };
  
  export const sendMessage = async (content: string, recipientId: number, senderId: number) => {
    try {
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); // Log the URL to check it

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, recipientId, senderId }),
      });
  
      if (!res.ok) throw new Error("Failed to send message");
      return await res.json();
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };
  