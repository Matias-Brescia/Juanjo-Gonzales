(function () {
  const {useState, useEffect, useRef} = React;

  function ChatComponent() {
    const [minimized, setMinimized] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
      const welcomeMessage = {
        text: "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?",
        sender: "bot",
      };
      setMessages((prev) => prev.concat(welcomeMessage));
      setChatHistory((prev) =>
        prev.concat({role: "assistant", content: welcomeMessage.text})
      );
    }, []);

    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({behavior: "smooth"});
      }
    }, [messages]);

    const sendMessage = async () => {
      const currentInput = input.trim();
      if (!currentInput) return;

      const newUserMessage = {text: currentInput, sender: "user"};
      setMessages((prev) => prev.concat(newUserMessage));
      const updatedHistory = chatHistory.concat({
        role: "user",
        content: currentInput,
      });
      setChatHistory(updatedHistory);
      setInput("");

      try {
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.2-90b-vision-preview",
            messages: [
              {
                role: "system",
                content:
                  "Eres un asistente de soporte técnico para chatbotenlinea.com. Tu especialidad es guiar a los usuarios a través de las funcionalidades del CRM. [... resto del mensaje de configuración ...]",
              },
            ].concat(updatedHistory),
          },
          {
            headers: {
              Authorization:
                "Bearer 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",
              "Content-Type": "application/json",
            },
          }
        );

        const botResponseText =
          (response.data.choices &&
            response.data.choices[0] &&
            response.data.choices[0].message &&
            response.data.choices[0].message.content) ||
          "Respuesta no disponible.";
        const botResponse = {text: botResponseText, sender: "bot"};
        setMessages((prev) => prev.concat(botResponse));
        setChatHistory((prev) =>
          prev.concat({role: "assistant", content: botResponseText})
        );
      } catch (error) {
        console.error(
          "Error al enviar el mensaje:",
          error.response ? error.response.data : error.message
        );
        setMessages((prev) =>
          prev.concat({text: "Error al obtener respuesta.", sender: "bot"})
        );
      }
    };

    const handleKeyDown = function (event) {
      if (event.key === "Enter") {
        sendMessage();
        event.preventDefault();
      }
    };

    const toggleMinimize = () => {
      setMinimized((prev) => !prev);
    };

    return React.createElement(
      "div",
      {className: "chat-component"},
      React.createElement(
        "div",
        {
          className: "chat-header p-2 bg-primary text-white",
          onClick: toggleMinimize,
          style: {cursor: "pointer"},
        },
        React.createElement("h6", {className: "m-0"}, "Chatbot"),
        React.createElement(
          "span",
          {className: "toggle-icon"},
          minimized ? "+" : "-"
        )
      ),
      !minimized &&
        React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "div",
            {
              className: "chat-messages p-3",
              style: {height: "300px", overflowY: "auto"},
            },
            messages.map(function (message, index) {
              const uniqueKey = `${message.sender}-${message.text}-${index}`;
              return React.createElement(
                "div",
                {
                  key: uniqueKey,
                  className: message.sender,
                  style: {marginBottom: "10px"},
                },
                React.createElement(
                  "strong",
                  null,
                  (message.sender === "user" ? "Tú" : "Mi Chatbot") + ": "
                ),
                message.text
              );
            }),
            React.createElement("div", {ref: messagesEndRef})
          ),
          React.createElement(
            "div",
            {className: "chat-input p-2 d-flex border-top"},
            React.createElement("input", {
              type: "text",
              value: input,
              onChange: function (e) {
                setInput(e.target.value);
              },
              onKeyDown: handleKeyDown,
              className: "form-control",
              placeholder: "Escribe tu mensaje...",
            }),
            React.createElement(
              "button",
              {onClick: sendMessage, className: "btn btn-primary ms-2"},
              "Enviar"
            )
          )
        )
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("chatWidget");
    if (container) {
      ReactDOM.render(React.createElement(ChatComponent), container);
    }
  });
})();
