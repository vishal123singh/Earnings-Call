// components/ui/ChatBox.jsx
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatBox = forwardRef(
  ({ context, onChartUpdate, chatState, setChatState }, ref) => {
    const { messages, inputMessage, isWaitingForResponse } = chatState;

    // Maintain local input state
    const [localInput, setLocalInput] = useState(inputMessage || "");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
      scrollToBottom();
    }, [messages, isWaitingForResponse]);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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
      setChatState((prev) => ({ ...prev, inputMessage: localInput }));
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
      }
    };

    const handleSendMessage = async (e, customMessage = null) => {
      e.preventDefault();
      const messageText = customMessage || localInput;
      if (!messageText.trim() || isWaitingForResponse) return;

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
      if (!customMessage) {
        setLocalInput("");
        updateChatState({ inputMessage: "" });
      }
      updateChatState({ isWaitingForResponse: true });

      try {
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
          onChartUpdate(result.data);
          addBotMessage(
            "I've updated the chart based on your request. How does it look?",
          );
        } else {
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
      <div className="flex flex-col h-full bg-card">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs sm:text-sm text-center px-4">
                Ask questions or request changes to the chart...
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`mb-3 flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-3 py-2 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm sm:text-base break-words">
                        {message.text}
                      </p>
                      <p
                        className={`text-[10px] sm:text-xs mt-1 opacity-70 ${
                          message.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isWaitingForResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 flex justify-start"
                  >
                    <div className="max-w-[85%] sm:max-w-[75%] rounded-lg px-3 py-2 bg-muted">
                      <div className="flex space-x-1.5">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground/60 animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-muted-foreground/60 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-border"
        >
          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="text"
              value={localInput}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
              disabled={isWaitingForResponse}
            />
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
              disabled={isWaitingForResponse || !localInput.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  },
);

ChatBox.displayName = "ChatBox";

export default ChatBox;
