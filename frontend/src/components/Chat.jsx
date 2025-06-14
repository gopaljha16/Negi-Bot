import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Copy, Check, Plus, MessageSquare, Sparkles, Code } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import TextareaAutosize from "react-textarea-autosize";

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! I'm NegiBot. Ask me anything 👋", id: 1 }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isCodeBlock = (text) => {
    return text.includes('```') || text.includes('function') || text.includes('const ') || 
           text.includes('import ') || text.includes('class ') || text.includes('def ') ||
           text.includes('<') && text.includes('>') || text.includes('SELECT') || text.includes('FROM');
  };

  const formatCodeBlock = (text) => {
    if (!isCodeBlock(text)) return text;
    
    // Handle markdown code blocks
    if (text.includes('```')) {
      return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'javascript'}">${code.trim()}</code></pre>`;
      });
    }
    
    // If it looks like code but doesn't have markdown, wrap it
    if (text.length > 50 && (text.includes('function') || text.includes('const ') || text.includes('import '))) {
      return `<pre><code class="language-javascript">${text}</code></pre>`;
    }
    
    return text;
  };

  const copyToClipboard = async (text, id) => {
    try {
      // Extract code from HTML if it's a code block
      const codeMatch = text.match(/<code[^>]*>([\s\S]*?)<\/code>/);
      const textToCopy = codeMatch ? codeMatch[1] : text;
      
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      sender: "user",
      text: trimmed,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axiosClient.post("/chat/ask", { message: trimmed });
      await new Promise(resolve => setTimeout(resolve, 1500));

      const botResponse = {
        sender: "bot",
        text: response?.data?.reply || `Here's a sample response for: "${trimmed}"\n\n\`\`\`javascript\nconst response = {\n  message: "${trimmed}",\n  status: "success",\n  data: {\n    result: "processed"\n  }\n};\n\nconsole.log(response);\n\`\`\``,
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        sender: "bot",
        text: "⚠️ Oops! Something went wrong. Please try again.",
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([
      { sender: "bot", text: "Hey! I'm NegiBot. Ask me anything 👋", id: Date.now() }
    ]);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const typingVariants = {
    animate: {
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex">
      {/* Sidebar */}
    

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          className="p-6 border-b border-purple-500/20 bg-slate-900/30 backdrop-blur-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white">NegiBot Assistant</h2>
                <p className="text-purple-300 text-sm">Always ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Online</span>
            </div>
          </div>
        </motion.div>

        {/* Messages Area */}
        <motion.div
          className="flex-1 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div
            ref={chatContainerRef}
            className="h-full overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`flex items-start gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </motion.div>

                  <motion.div
                    className={`max-w-[75%] group ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600/90 to-cyan-600/90 backdrop-blur-sm"
                        : "bg-slate-800/50 backdrop-blur-sm"
                    } rounded-2xl px-5 py-4 border ${
                      msg.sender === "user" ? "border-blue-500/30" : "border-slate-700/30"
                    } relative`}
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
                    }}
                  >
                    {/* Copy Button */}
                    <motion.button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className={`absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                        msg.sender === "user" 
                          ? "bg-blue-700/50 hover:bg-blue-600/50" 
                          : "bg-slate-700/50 hover:bg-slate-600/50"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-300" />
                      )}
                    </motion.button>

                    {/* Message Content */}
                    <div className="pr-10">
                      {isCodeBlock(msg.text) ? (
                        <div className="space-y-3">
                          {msg.text.split('```').map((part, index) => {
                            if (index % 2 === 1) {
                              // This is a code block
                              const lines = part.split('\n');
                              const language = lines[0] || 'javascript';
                              const code = lines.slice(1).join('\n');
                              
                              return (
                                <div key={index} className="relative">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Code className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs text-purple-300 font-medium">{language}</span>
                                  </div>
                                  <pre className="bg-slate-900/80 rounded-xl p-4 overflow-x-auto border border-slate-700/30">
                                    <code className="text-sm text-slate-200 font-mono">
                                      {code}
                                    </code>
                                  </pre>
                                </div>
                              );
                            } else {
                              // Regular text
                              return part.trim() && (
                                <p key={index} className="text-white text-sm leading-relaxed break-words whitespace-pre-wrap">
                                  {part.trim()}
                                </p>
                              );
                            }
                          })}
                        </div>
                      ) : (
                        <p className="text-white text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}
                      
                      {msg.timestamp && (
                        <p className={`text-xs mt-2 ${msg.sender === "user" ? "text-blue-200/70" : "text-slate-400"}`}>
                          {msg.timestamp}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-start gap-4"
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                    variants={typingVariants}
                    animate="animate"
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl px-5 py-4 border border-slate-700/30">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                          animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        {/* Input Area */}
        <motion.div
          className="p-6 border-t border-purple-500/20 bg-slate-900/30 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <TextareaAutosize
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything... I can help with code, questions, or just chat!"
                className="w-full p-4 pr-16 bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-2xl text-white placeholder-slate-300 resize-none focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all scrollbar-thin scrollbar-thumb-purple-500/20"
                minRows={1}
                maxRows={5}
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
                Enter to send
              </div>
            </div>

            <motion.button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/30 transition-all duration-300"
              whileHover={!isTyping && input.trim() ? { scale: 1.05 } : {}}
              whileTap={!isTyping && input.trim() ? { scale: 0.95 } : {}}
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;