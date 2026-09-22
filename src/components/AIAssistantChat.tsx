import React, { useState, useRef, useEffect } from "react";
import { DoctorProfile, ChatMessage } from "../types";
import { Bot, Send, Sparkles, X, Minimize2, Maximize2, Loader2, Stethoscope, ShieldCheck } from "lucide-react";

interface AIAssistantChatProps {
  doctorProfile: DoctorProfile;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ doctorProfile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: `Hello ${doctorProfile.name}! 👋 How can I assist you today with clinical summaries, differential diagnosis, or drug interactions?`,
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          doctorInfo: doctorProfile,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.text || "I apologize, I could not generate a response at this moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "⚠️ Connection error. Please check backend AI integration.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xs rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-white"
      >
        <Bot className="w-5 h-5 text-blue-200" />
        AI Assistant
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-200 flex flex-col ${
        isMinimized ? "w-80 h-14" : "w-88 sm:w-96 h-[480px]"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
            <Bot className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <h3 className="text-xs font-bold leading-none flex items-center gap-1.5">
              AI Assistant <span className="px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 text-[9px] rounded font-mono">ONLINE</span>
            </h3>
            <p className="text-[10px] text-blue-100 mt-0.5">MediCore AI Clinical Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/10 rounded-lg text-blue-100 transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg text-blue-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-xs shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 bg-white p-2.5 rounded-2xl border border-slate-200 w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-[11px] font-medium">Analyzing medical query...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-1.5 bg-slate-100/70 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-[10px] shrink-0">
            <button
              onClick={() => handleSendMessage("Summarize Arjun Sharma's latest consultation notes and vitals.")}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-semibold whitespace-nowrap transition-colors"
            >
              Summarize Patient
            </button>
            <button
              onClick={() => handleSendMessage("Suggest differential diagnosis for chest tightness, diaphoresis, and left arm pain.")}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-semibold whitespace-nowrap transition-colors"
            >
              Suggest Diagnosis
            </button>
            <button
              onClick={() => handleSendMessage("Check potential drug interactions between Amlodipine 5mg and Atorvastatin 20mg.")}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-semibold whitespace-nowrap transition-colors"
            >
              Check Drug Interaction
            </button>
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 text-xs bg-slate-100 focus:bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
