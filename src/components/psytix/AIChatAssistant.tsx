import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { psychologyBlocks, salesBlocks } from "@/data/courses";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

const allBlocks = [...psychologyBlocks, ...salesBlocks];

const botResponses: Record<string, string> = {
  привет: "Привет! 👋 Я AI-ассистент Psytix. Помогу подобрать идеальный модуль обучения. Что вас интересует: психология или продажи?",
  психология: `Отличный выбор! У нас 8 модулей по психологии:\n\n${psychologyBlocks.map((b, i) => `${i + 1}. **${b.title}** — ${b.benefitText}`).join("\n")}\n\nКакой модуль вас интересует? Назовите номер или тему.`,
  продажи: `Супер! Вот наши 8 модулей по продажам:\n\n${salesBlocks.map((b, i) => `${i + 1}. **${b.title}** — ${b.benefitText}`).join("\n")}\n\nКакой модуль хотите изучить подробнее?`,
  default: "Я могу помочь выбрать модуль обучения! Попробуйте спросить про «психологию», «продажи» или конкретную тему — например, «стресс», «переговоры» или «влияние».",
};

const findResponse = (input: string): string => {
  const lower = input.toLowerCase();
  
  // Check for block match
  const matchedBlock = allBlocks.find(
    (b) =>
      lower.includes(b.title.toLowerCase()) ||
      b.title.toLowerCase().split(" ").some((word) => word.length > 3 && lower.includes(word))
  );
  
  if (matchedBlock) {
    return `📘 **${matchedBlock.title}**\n\n${matchedBlock.description}\n\n✅ Результат: ${matchedBlock.benefitText}\n📊 Эффективность: ${matchedBlock.metricsBefore}% → ${matchedBlock.metricsAfter}%\n🏷️ ${matchedBlock.badgeText}`;
  }

  // Check keywords
  for (const [key, value] of Object.entries(botResponses)) {
    if (key !== "default" && lower.includes(key)) return value;
  }

  // Topic matching
  if (lower.includes("стресс") || lower.includes("выгоран")) return `Рекомендую модуль «Управление стрессом»! ${psychologyBlocks[4].description}`;
  if (lower.includes("перегов") || lower.includes("закрыт")) return `Обратите внимание на «Переговоры и закрытие»! ${salesBlocks[5].description}`;
  if (lower.includes("мотивац")) return `Модуль «Психология мотивации» — то, что нужно! ${psychologyBlocks[6].description}`;
  if (lower.includes("холодн") || lower.includes("звонк")) return `«Холодные продажи» — наш интенсивный модуль! ${salesBlocks[3].description}`;

  return botResponses.default;
};

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Привет! 👋 Я AI-ассистент Psytix. Задайте вопрос или выберите тему: **психология** или **продажи**?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: findResponse(input),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full gradient-primary shadow-glow hover:scale-110 transition-transform"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] glass-card rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-primary px-5 py-4 flex items-center gap-3">
              <Bot className="w-6 h-6 text-primary-foreground" />
              <div>
                <p className="text-sm font-semibold text-primary-foreground">AI-ассистент Psytix</p>
                <p className="text-xs text-primary-foreground/70">Помогу выбрать модуль</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary text-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Спросите о модуле..."
                  className="flex-1 text-sm bg-secondary/50 border-0"
                />
                <Button type="submit" size="icon" className="gradient-primary flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
