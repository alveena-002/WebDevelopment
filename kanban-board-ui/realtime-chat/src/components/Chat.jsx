import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    getMessages();

    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((prev) => {
            const alreadyExists = prev.some(
              (msg) => msg.id === payload.new.id
            );

            if (alreadyExists) return prev;

            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("id", { ascending: true });

    if (!error) {
      setMessages(data);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        text: input,
      },
    ]);

    if (!error) {
      setInput("");
    }
  }

  return (
    <div style={{ width: "400px", margin: "30px auto" }}>
      <h2>Realtime Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg) => (
          <p key={msg.id}>{msg.text}</p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%", padding: "8px" }}
      />

      <button
        onClick={sendMessage}
        style={{ marginLeft: "10px", padding: "8px 15px" }}
      >
        Send
      </button>
    </div>
  );
}

export default Chat;