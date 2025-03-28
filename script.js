document.addEventListener("DOMContentLoaded", function () {
  console.log("Página cargada y lista.");

  // Demo interactiva del chatbot
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");

  sendBtn.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
      // Mostrar mensaje del usuario
      const userMsgElem = document.createElement("div");
      userMsgElem.classList.add("mb-2");
      userMsgElem.innerHTML = `<strong>Tú:</strong> ${message}`;
      chatMessages.appendChild(userMsgElem);
      userInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Respuesta simulada del chatbot
      setTimeout(() => {
        const botMsgElem = document.createElement("div");
        botMsgElem.classList.add("mb-2");
        botMsgElem.innerHTML = `<strong>Mi Chatbot:</strong> Gracias por tu mensaje. Pronto te responderé.`;
        chatMessages.appendChild(botMsgElem);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    }
  });

  // Permitir enviar mensaje con Enter
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendBtn.click();
      e.preventDefault();
    }
  });

  // Manejo del formulario de contacto (demo)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Gracias por contactarnos. Pronto nos comunicaremos contigo.");
      contactForm.reset();
    });
  }
});
