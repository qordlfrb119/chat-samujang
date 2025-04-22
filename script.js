document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    userInput.value = "";

    const loading = appendMessage("bot", "📡 분석 중입니다...");

    try {
      const res = await fetch("https://chat-samujang.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      loading.textContent = data.reply;
     // ✅ TTS 기능 추가
      speakText(data.reply);
    } catch (err) {
      loading.textContent = "❌ 오류 발생: " + err.message;
    }
  });

  function appendMessage(sender, text) {
    const div = document.createElement("div");
    div.className = sender === "user" ? "user-message" : "bot-message";
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
  }

// ✅ TTS 함수 추가
  function speakText(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ko-KR"; // 한국어로 설정
    speechSynthesis.speak(utter);
  }
});