import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    
    if (!token) {
      router.push("/login");
    } else {
      try {
        const decoded: { id: number } = jwtDecode(token);
        console.log("Decoded token:", decoded); 
        fetch(`${API_URL}/api/users/${decoded.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Fetched user data:", data); 
            setCurrentUser(data); 
          })
          .catch((err) => {
            console.error("Error fetching current user:", err);
            router.push("/login"); 
          });
      } catch (err) {
        console.error("Error decoding token:", err);
        router.push("/login"); 
      }
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error fetching users");
          return res.json();
        })
        .then((data) => setUsers(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error("Error fetching users:", err);
        });
    }
  }, []);

  // Fetch messages for the selected user whenever it changes
  useEffect(() => {
    if (selectedUser) {
      const token = localStorage.getItem("token");
      fetch(`${API_URL}/api/messages?recipientId=${selectedUser}`, {
        method: "GET",
        credentials: "include", // ensures cookies are sent
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized or fetch error");
          return res.json();
        })
        .then((data) => setMessages(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error("Error fetching messages:", err);
          setMessages([]);
        });
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!newMessage || !selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage, recipientId: selectedUser }),
      });

      if (!res.ok) throw new Error("Error sending message");

      const sentMessage = await res.json();
      setMessages([...messages, sentMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const filteredUsers = currentUser
    ? users.filter((user) => user.id !== currentUser.id)
    : users;

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar: List of Users and Logout button */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:block w-3/4 md:w-1/4 bg-slate-700 border-r overflow-y-auto p-4 fixed inset-0 md:relative md:w-1/4 md:flex-none transition-all duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-white">Users</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="space-y-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`w-full text-left p-2 rounded hover:bg-green-100 hover:text-black ${
                  selectedUser === user.id ? "bg-indigo-200" : ""
                } flex items-center space-x-2`}
              >
                {/* User icon (SVG) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-person text-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a3 3 0 1 0 3 3 3 3 0 0 0-3-3zM8 4a3 3 0 1 0 3 3 3 3 0 0 0-3-3zM7 8a5 5 0 0 1 10 1v1a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a5 5 0 0 1 2-5z"/>
                </svg>
                <span className="text-white">{user.name}</span>
              </button>
            ))
          ) : (
            <p className="text-gray-500">No users available</p>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden absolute top-4 left-4 z-20 text-white"
      >
        {isSidebarOpen ? "Close" : "Open"} Sidebar
      </button>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col bg-slate-500 p-4 transition-all duration-300 ${
          isSidebarOpen ? "ml-3/4" : "ml-0"
        }`}
      >
        <div className="flex-grow overflow-y-auto">
          {selectedUser ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">
                Chat with{" "}
                {users.find((user) => user.id === selectedUser)?.name || "User"}
              </h2>
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded max-w-md ${
                        msg.senderId === selectedUser
                          ? "bg-green-500 text-xl text-left"
                          : "bg-blue-500 text-right text-xl ml-auto"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className="text-xs text-gray-600">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No messages yet</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a user to start chatting</p>
          )}
        </div>

        {selectedUser && (
          <div className="p-4 border-t flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded text-black focus:outline-none focus:border-green-600"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
