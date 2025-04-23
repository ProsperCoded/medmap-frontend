import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, UserCircle2, Bot } from "lucide-react";
import { socket } from "../../socket";
import { marked } from "marked";

type Message = {
  from: "bot" | "user";
  text: string;
  time: string;
};

const PharmacyAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hi there! I'm your AI pharmacy assistant. I can help you find medications and give general information about them. What would you like to know today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      from: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Send message to server
    socket.emit("user-message", { message: input.trim(), context: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    // Listen for bot response
    socket.on("bot-message", ({ message }) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      socket.off("bot-message");
    };
  }, []);

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-[#22c3dd] p-5 rounded-full shadow-2xl hover:bg-cyan-400 z-50 transition duration-300"
      >
        <Bot className="w-7 h-7 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-28 right-6 w-[380px] bg-gray-900 rounded-3xl shadow-2xl text-white z-50 flex flex-col overflow-hidden border border-[#22c3dd]/20"
          >
            <div className="p-5 bg-[#22c3dd] text-black text-xl font-bold flex justify-between items-center">
              <span>Pharmacy Assistant</span>
              <button
                onClick={toggleChat}
                className="text-black text-2xl hover:text-white"
              >
                ×
              </button>
            </div>

            <div
              className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[400px] bg-gray-800"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    msg.from === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  {msg.from === "bot" && (
                    <div className="text-[#22c3dd]">
                      <Bot size={24} />
                    </div>
                  )}
                  <div>
                    <div
                      className={`inline-block p-2 rounded-2xl max-w-[80%] ${
                        msg.from === "bot"
                          ? "bg-gray-700 text-white bot-message"
                          : "bg-[#22c3dd] text-black"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: marked.parseInline(msg.text),
                      }}
                    />

                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {msg.time}
                    </div>
                  </div>
                  {msg.from === "user" && (
                    <div className="text-[#22c3dd]">
                      <UserCircle2 size={24} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[#22c3dd]">
                  <Bot size={24} />
                  <div className="flex space-x-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-900 border-t border-gray-700 flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-xl bg-gray-700 text-white focus:outline-none text-base"
              />
              <button
                onClick={handleSend}
                className="p-3 rounded-full bg-gradient-to-br from-[#22c3dd] to-cyan-400 text-white hover:scale-105 transition"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PharmacyAssistant;
