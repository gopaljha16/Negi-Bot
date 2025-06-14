export const useSpeech = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;

  const startListening = () => {
    return new Promise((resolve) => {
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };
    });
  };

  return { startListening };
};