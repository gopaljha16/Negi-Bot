import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Copy, Check, Volume2, VolumeX, Code } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import TextareaAutosize from "react-textarea-autosize";

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! I'm NegiBot. Ask me anything 👋", id: 1 }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const currentUtterance = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (currentUtterance.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const isCodeBlock = (text) => {
    return text.includes('```') || text.includes('function') || text.includes('const ') || 
           text.includes('import ') || text.includes('class ') || text.includes('def ') ||
           (text.includes('<') && text.includes('>') && text.includes('/')) || 
           text.includes('SELECT') || text.includes('FROM') || text.includes('console.log');
  };

  const cleanTextForSpeech = (text) => {
    // Remove markdown code blocks and HTML tags
    let cleanText = text.replace(/```[\s\S]*?```/g, '');
    cleanText = cleanText.replace(/<[^>]*>/g, '');
    cleanText = cleanText.replace(/[#*_`]/g, '');
    cleanText = cleanText.replace(/⚠️|👋|🎉|🚀|💡/g, ''); // Remove emojis
    return cleanText.trim();
  };

  const speakText = async (text, messageId) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    // Stop any ongoing speech
    if (currentUtterance.current) {
      speechSynthesis.cancel();
      setSpeakingId(null);
    }

    // If clicking the same message that's speaking, just stop
    if (speakingId === messageId) {
      return;
    }

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.current = utterance;

    // Get available voices and select a male voice
    const voices = speechSynthesis.getVoices();
    const maleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('male') || 
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('mark') ||
      voice.gender === 'male'
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setSpeakingId(messageId);
    };

    utterance.onend = () => {
      setSpeakingId(null);
      currentUtterance.current = null;
    };

    utterance.onerror = () => {
      setSpeakingId(null);
      currentUtterance.current = null;
    };

    speechSynthesis.speak(utterance);
  };

  const copyToClipboard = async (text, id) => {
    try {
      // Extract code from code blocks if present
      const codeBlockRegex = /```[\s\S]*?```/g;
      const codeBlocks = text.match(codeBlockRegex);
      
      let textToCopy = text;
      if (codeBlocks && codeBlocks.length > 0) {
        // If there are code blocks, copy the first one without the markdown
        textToCopy = codeBlocks[0].replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

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
      // Make actual API call to your backend
      const response = await axiosClient.post("/chat/ask", { message: trimmed });
      
      const botResponse = {
        sender: "bot",
        text: response?.data?.reply || response?.data?.message || "I'm having trouble responding right now. Please try again.",
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
      
    } catch (err) {
      console.error('API Error:', err);
      
      let errorMessage = "⚠️ Oops! Something went wrong. Please try again.";
      
      // Handle different types of errors
      if (err.response?.status === 404) {
        errorMessage = "⚠️ API endpoint not found. Please check your backend configuration.";
      } else if (err.response?.status === 500) {
        errorMessage = "⚠️ Server error. Please try again in a moment.";
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = "⚠️ Network error. Please check your connection.";
      }
      
      const errorMsg = {
        sender: "bot",
        text: errorMessage,
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
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="h-[calc(100vh-5rem)] flex flex-col max-w-7xl mx-auto">
        
        {/* Messages Area - Adjusted for navbar */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <motion.div
            ref={chatContainerRef}
            className="h-full overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
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
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Text-to-Speech Button */}
                      <motion.button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`p-2 rounded-lg ${
                          msg.sender === "user" 
                            ? "bg-blue-700/50 hover:bg-blue-600/50" 
                            : "bg-slate-700/50 hover:bg-slate-600/50"
                        } ${speakingId === msg.id ? 'ring-2 ring-purple-400' : ''}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-slate-300" />
                        )}
                      </motion.button>

                      {/* Copy Button */}
                      <motion.button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className={`p-2 rounded-lg ${
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
                    </div>

                    {/* Message Content */}
                    <div className="pr-16">
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
          </motion.div>
        </div>

        {/* Input Area */}
        <motion.div
          className="flex-shrink-0 p-6 border-t border-purple-500/20 bg-slate-900/30 backdrop-blur-xl"
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