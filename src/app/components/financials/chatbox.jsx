// components/ui/ChatBox.jsx
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatBox = forwardRef(
  ({ context, onChartUpdate, chatState, setChatState }, ref) => {
    const { messages, inputMessage, isWaitingForResponse } = chatState;

    // Maintain local input state
    const [localInput, setLocalInput] = useState(inputMessage || "");

    // Expose functions to parent component
    useImperativeHandle(ref, () => ({
      sendMessage: (message) => {
        handleSendMessage({ preventDefault: () => {} }, message);
      },
    }));

    const updateChatState = (updates) => {
      setChatState((prev) => ({ ...prev, ...updates }));
    };

    const handleInputChange = (e) => {
      setLocalInput(e.target.value);
    };

    const handleBlur = () => {
      // Call setChatState only when input is finalized
      setChatState((prev) => ({ ...prev, inputMessage: localInput }));
    };

    const handleSendMessage = async (e, customMessage = null) => {
      e.preventDefault();
      const messageText = customMessage || inputMessage;
      if (!messageText.trim()) return;

      // Add user message
      const userMessage = {
        id: Date.now(),
        text: messageText,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      updateChatState({ messages: [...messages, userMessage] });
      if (!customMessage) updateChatState({ inputMessage: "" });
      updateChatState({ isWaitingForResponse: true });

      try {
        // Send to API endpoint
        const response = await fetch("/api/generate-chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: messageText,
            ...context,
            isModificationRequest: true,
          }),
        });

        if (!response.ok) throw new Error("Failed to get AI response");
        const result = await response.json();

        if (result.type === "chart_update") {
          // Handle chart update
          onChartUpdate(result.data);
          addBotMessage(
            "I've updated the chart based on your request. How does it look?",
          );
        } else {
          // Handle regular response
          addBotMessage(result.text || "I've processed your request.");
        }
      } catch (error) {
        console.error("Error:", error);
        addBotMessage(
          "Sorry, I encountered an error processing your request. Please try again.",
        );
      } finally {
        updateChatState({ isWaitingForResponse: false });
      }
    };

    const addBotMessage = (text) => {
      const botMessage = {
        id: Date.now() + 1,
        text,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      updateChatState({ messages: [...chatState.messages, botMessage] });
    };

    return (
      <div className="flex flex-col h-full">
        {/* Messages container */}
        <div className="flex-1 p-4 overflow-y-auto">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Ask questions or request changes to the chart...
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-3 flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70 text-right">
                      {message.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            {isWaitingForResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 flex justify-start"
              >
                <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100 text-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={localInput}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isWaitingForResponse}
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              disabled={isWaitingForResponse || !inputMessage.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  },
);

ChatBox.displayName = 'ChatBox';

export default ChatBox;