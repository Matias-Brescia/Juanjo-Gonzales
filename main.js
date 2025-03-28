document.addEventListener("DOMContentLoaded", function () {
  console.log("Página cargada y lista.");

  // Inicializa AOS si aún no está
  AOS.init({
    duration: 1000,
    once: true,
  });

  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");

  async function sendMessageToBot(userMessage) {
    try {
      const response = await fetch("http://localhost:3009/v1/messages", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          number: "demo",
          message: userMessage,
          urlMedia: null,
        }),
      });
      const data = await response.text();
      console.log("Respuesta del servidor:", data);
      // Aquí podrías implementar la lógica para recibir y mostrar respuestas
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  }

  sendBtn.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (message) {
      // Mostrar mensaje del usuario
      const userMsgElem = document.createElement("div");
      userMsgElem.classList.add("mb-2");
      userMsgElem.innerHTML = `<strong>Tú:</strong> ${message}`;
      chatMessages.appendChild(userMsgElem);
      userInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Enviar mensaje al backend
      await sendMessageToBot(message);
    }
  });

  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendBtn.click();
      e.preventDefault();
    }
  });
});
