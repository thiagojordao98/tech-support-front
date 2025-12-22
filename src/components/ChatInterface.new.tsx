import { useState, useRef, useEffect } from "react";
import type { ChatMessage, UserInfo } from "../types/api";
import { chatAPI } from "../services/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Send, X, Bot, User, Loader2, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

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

      if (!sessionId) {
        setSessionId(response.session_id);
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-5xl h-[90vh] max-h-[800px] flex flex-col backdrop-blur-sm bg-card/95 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Chat de Suporte</h2>
              <p className="text-sm text-muted-foreground">{userInfo.name}</p>
            </div>
            {sessionId && (
              <Badge variant="secondary" className="ml-2 font-mono text-xs">
                {sessionId}
              </Badge>
            )}
          </div>
          <Button variant="destructive" size="sm" onClick={handleEndChat}>
            <X className="h-4 w-4 mr-2" />
            Encerrar
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-secondary/20">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "flex gap-3 max-w-[75%]",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "rounded-full p-2 h-fit",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 shadow-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border rounded-bl-sm"
                  )}
                >
                  <div className="prose text-sm">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.timestamp && (
                    <p
                      className={cn(
                        "text-xs mt-2 opacity-70",
                        msg.role === "user"
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="flex gap-3 max-w-[75%]">
                <div className="rounded-full p-2 bg-muted h-fit">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-card border rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Ticket Info */}
        {ticketNumber && !userInfo.isRegistered && (
          <div className="px-6 py-4 bg-green-50 dark:bg-green-950 border-t-2 border-green-500">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Ticket className="h-4 w-4" />
              <p className="text-sm font-medium">
                <strong>Protocolo:</strong> {ticketNumber}
              </p>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
              Salve este número para acompanhar seu atendimento
            </p>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="flex gap-3 p-6 border-t bg-card/50 backdrop-blur-sm"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva sua mensagem..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()} size="lg">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
