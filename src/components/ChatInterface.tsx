import { useState, useRef, useEffect } from "react";
import type { ChatMessage, UserInfo } from "../types/api";
import { chatAPI } from "../services/api";

interface ChatInterfaceProps {
  userInfo: UserInfo;
  onBack: () => void;
}

export default function ChatInterface({
  userInfo,
  onBack,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [ticketNumber, setTicketNumber] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        role: "assistant",
        content: `Olá, ${userInfo.name}! 👋\n\nSou seu assistente virtual. Estou aqui para ajudar com suas dúvidas ou abrir um chamado de suporte.\n\nComo posso te ajudar hoje?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [userInfo.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Add user message
    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await chatAPI.sendMessage({
        message: userMessage,
        session_id: sessionId || undefined,
      });

      // Store session ID
      if (!sessionId) {
        setSessionId(response.session_id);
      }

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Extract ticket number if present
      const ticketMatch = response.response.match(/ID.*?`([a-f0-9-]+)`/i);
      if (ticketMatch && !userInfo.isRegistered) {
        setTicketNumber(ticketMatch[1]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "❌ Desculpe, houve um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndChat = () => {
    if (window.confirm("Deseja finalizar o atendimento?")) {
      onBack();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>Chat de Suporte</h2>
          <p className="user-label">{userInfo.name}</p>
          {sessionId && <span className="session-id">{sessionId}</span>}
        </div>
        <button onClick={handleEndChat} className="btn-close">
          Encerrar
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">
              <div className="message-text">{msg.content}</div>
              {msg.timestamp && (
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {ticketNumber && !userInfo.isRegistered && (
        <div className="ticket-info">
          <strong>Protocolo:</strong> {ticketNumber}
          <br />
          <small>Salve este número para acompanhar seu atendimento</small>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva sua mensagem..."
          disabled={loading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-send"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
