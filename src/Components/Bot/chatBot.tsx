import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

const PharmacyAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! I'm your AI pharmacy assistant. I can help you find medications, provide general information about drugs, and answer health-related questions. How can I assist you today?",
      time: "02:01 AM",
    },
  ]);

  const chatRef = useRef();

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      from: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
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

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-[#22c3dd] p-5 rounded-full shadow-2xl hover:bg-cyan-400 z-50 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-9 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-28 right-6 w-[360px] bg-gray-900 rounded-3xl shadow-2xl text-white z-50 flex flex-col overflow-hidden border border-[#22c3dd]/20"
          >
            {/* Header */}
            <div className="p-5 bg-[#22c3dd] text-black text-xl font-bold flex justify-between items-center">
              <span>Pharmacy Assistant</span>
              <button
                onClick={toggleChat}
                className="text-black text-2xl hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Message History */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[400px] bg-gray-800">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`text-base ${
                    msg.from === "bot" ? "text-left" : "text-right"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] ${
                      msg.from === "bot"
                        ? "bg-gray-700 text-white"
                        : "bg-[#22c3dd] text-black"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
                </div>
              ))}
            </div>

            {/* Input */}
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
