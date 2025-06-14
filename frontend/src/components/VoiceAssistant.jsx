import React, { useState } from "react";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition(); // or SpeechRecognition
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = (event) => console.error("Speech error", event);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const userText = event.results[0][0].transcript;
      setTranscript(userText);
      sendToGemini(userText);
    };

    recognition.start();
  };

  const sendToGemini = async (userText) => {
    try {
      const res = await fetch("http://localhost:3000/testing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      const aiReply = data.reply;
      setResponse(aiReply);
      speakOutLoud(aiReply);
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  const speakOutLoud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-2">🎙️ AI Voice Assistant</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={startListening}
      >
        {isListening ? "Listening..." : "Start Talking"}
      </button>

      <div className="mt-4">
        <p><strong>You said:</strong> {transcript}</p>
        <p><strong>AI says:</strong> {response}</p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
