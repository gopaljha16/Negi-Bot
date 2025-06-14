import { useSpeech } from "./useSpeech";

// App.jsx


const Test = () => {
  const { startListening } = useSpeech();

  const handleConversation = async () => {
    const userInput = await startListening();

    const res = await fetch("http://localhost:3000/testing", {
      method: "POST",
      body: JSON.stringify({ text: userInput }),
      headers: { "Content-Type": "application/json" },
    });

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();

    audio.onended = () => {
      // 🔁 Continue conversation
      handleConversation();
    };
  };

  return (
    <button onClick={handleConversation}>Start Talking</button>
  );
};

export default Test;
