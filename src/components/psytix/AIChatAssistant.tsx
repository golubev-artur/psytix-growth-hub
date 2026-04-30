import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, FileText, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { psychologyBlocks, salesBlocks } from "@/data/courses";
import { blogPosts } from "@/data/blogData";
import { sendLeadToTelegram } from "@/lib/telegram";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

const allBlocks = [...psychologyBlocks, ...salesBlocks];

// ─── Контекст страницы ────────────────────────────────────────────────────────
interface PageContext {
  greeting: string;
  promoText: string;
  promoSubtext: string;
  formInterest: string; // предзаполнение поля интереса в форме
  topic: string;        // короткое название темы для ответов бота
}

const getPageContext = (pathname: string): PageContext => {
  if (pathname.startsWith("/blog/psy/")) {
    const slug = pathname.replace("/blog/psy/", "");
    const post = blogPosts.find((p) => p.slug === slug);
    const title = post?.title ?? "психологии";
    return {
      greeting: `Читаете «${title}»? 🧠\nЗадайте вопрос по этой теме — или расскажите о вашей ситуации, помогу подобрать модуль.`,
      promoText: "Хотите разобраться глубже?",
      promoSubtext: `Расскажите о вашей ситуации — дам совет по теме «${title}»`,
      formInterest: `Интересует тема: ${title}`,
      topic: title,
    };
  }
  if (pathname.startsWith("/blog/sal/")) {
    const slug = pathname.replace("/blog/sal/", "");
    const post = blogPosts.find((p) => p.slug === slug);
    const title = post?.title ?? "продаж";
    return {
      greeting: `Читаете «${title}»? 📈\nХотите применить это в своих продажах? Расскажите о вашей ситуации.`,
      promoText: "Есть вопросы по теме?",
      promoSubtext: `Помогу применить «${title}» в вашей практике`,
      formInterest: `Интересует тема: ${title}`,
      topic: title,
    };
  }
  if (pathname === "/blog") {
    return {
      greeting: "Изучаете блог Psytix? 📚\nМогу подсказать, с каких статей начать — расскажите о ваших целях.",
      promoText: "Много статей — с чего начать?",
      promoSubtext: "Расскажите о задачах — подберу лучшие материалы для вас",
      formInterest: "Хочу разобраться в материалах блога",
      topic: "блог Psytix",
    };
  }
  if (pathname === "/reviews") {
    return {
      greeting: "Читаете отзывы студентов? ⭐\nРасскажите о своей ситуации — помогу выбрать модуль, который даст такой же результат.",
      promoText: "Хотите таких же результатов?",
      promoSubtext: "Расскажите о своих целях — подберу модуль именно для вас",
      formInterest: "Хочу обучение как у студентов в отзывах",
      topic: "обучение на Psytix",
    };
  }
  return {
    greeting: "Привет! 👋 Я AI-ассистент Psytix.\nРасскажите о своих целях — помогу выбрать идеальный модуль по психологии или продажам.",
    promoText: "Не знаете с чего начать?",
    promoSubtext: "Расскажите о ваших целях — подберу идеальный модуль за 1 минуту",
    formInterest: "",
    topic: "обучение на Psytix",
  };
};

// ─── Умные ответы бота ───────────────────────────────────────────────────────
const FORM_TRIGGERS = ["заявк", "записаться", "хочу учиться", "начать обучение", "как записаться", "оставить заявку"];

const findResponse = (input: string, topic: string): string => {
  const lower = input.toLowerCase();

  // Намерение оставить заявку
  if (FORM_TRIGGERS.some((t) => lower.includes(t))) {
    return `Отлично! Нажмите кнопку «Оставить заявку» ниже — заполните форму за 1 минуту, и мы свяжемся с вами в течение 24 часов. 🚀`;
  }

  // Конкретный блок
  const matchedBlock = allBlocks.find(
    (b) =>
      lower.includes(b.title.toLowerCase()) ||
      b.title.toLowerCase().split(" ").some((w) => w.length > 3 && lower.includes(w))
  );
  if (matchedBlock) {
    return `📘 **${matchedBlock.title}**\n\n${matchedBlock.description}\n\n✅ ${matchedBlock.benefitText}\n📊 Рост: ${matchedBlock.metricsBefore}% → ${matchedBlock.metricsAfter}%\n\nХотите записаться на этот модуль? Нажмите «Оставить заявку» 👇`;
  }

  // Тематика
  if (lower.includes("психолог")) return `У нас 8 модулей по психологии: когнитивные искажения, эмоциональный интеллект, нейромаркетинг и другие.\n\nКакая тема вас интересует больше всего? Или сразу оставьте заявку — подберём модуль под вас 👇`;
  if (lower.includes("продаж")) return `8 модулей по продажам: SPIN-техники, работа с возражениями, переговоры, холодные звонки и другие.\n\nРасскажите о вашей задаче — или нажмите «Оставить заявку» 👇`;
  if (lower.includes("стресс") || lower.includes("выгоран")) return `Для вас подойдёт модуль «Управление стрессом и эмоциями».\n\n${psychologyBlocks[4]?.description ?? ""}\n\nОставьте заявку — начнём уже на следующей неделе 👇`;
  if (lower.includes("перегов") || lower.includes("закрыт")) return `Модуль «Переговоры и закрытие сделок» — то, что нужно!\n\n${salesBlocks[5]?.description ?? ""}\n\nНажмите «Оставить заявку» 👇`;
  if (lower.includes("мотивац")) return `Модуль «Психология мотивации» идеально подойдёт.\n\n${psychologyBlocks[6]?.description ?? ""}\n\nОставьте заявку 👇`;
  if (lower.includes("холодн") || lower.includes("звонк")) return `«Холодные продажи» — интенсивный практический модуль.\n\n${salesBlocks[3]?.description ?? ""}\n\nЗаписывайтесь 👇`;
  if (lower.includes("цен") || lower.includes("сколько стоит") || lower.includes("стоимость")) return `Стоимость зависит от выбранного модуля и формата обучения.\n\nОставьте заявку — менеджер свяжется и расскажет актуальные условия и спецпредложения 👇`;
  if (lower.includes("привет") || lower.includes("здравствуй") || lower.includes("добрый")) return `Привет! 👋 Рад видеть вас на Psytix.\n\nЧем могу помочь? Расскажите о своих задачах в области ${topic} — подберём подходящий модуль.`;
  if (lower.includes("спасибо") || lower.includes("благодар")) return `Пожалуйста! 😊 Если решитесь начать обучение — нажмите «Оставить заявку» ниже. Мы свяжемся в течение 24 часов.`;

  return `Понимаю! Расскажите подробнее о вашей ситуации — чем конкретно занимаетесь и что хотите улучшить в теме «${topic}»?\n\nИли сразу оставьте заявку, и мы подберём всё индивидуально 👇`;
};

// ─── Форма заявки ─────────────────────────────────────────────────────────────
const LeadFormInChat = ({ defaultInterest, onSuccess }: { defaultInterest: string; onSuccess: () => void }) => {
  const [form, setForm] = useState({ name: "", email: "", interest: defaultInterest });
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendLeadToTelegram({
      name: form.name,
      email: form.email,
      interest: form.interest,
      page: window.location.href,
      button: "AI-чат → Оставить заявку",
    });
    setLoading(false);
    toast.success("Заявка отправлена! Свяжемся с вами в течение 24 часов.");
    onSuccess();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-2 mt-2"
    >
      <Input
        required
        placeholder="Ваше имя *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="text-sm bg-background/60 border-border/50"
      />
      <Input
        required
        type="email"
        placeholder="Email *"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="text-sm bg-background/60 border-border/50"
      />
      <Textarea
        rows={2}
        placeholder="Что вас интересует?"
        value={form.interest}
        onChange={(e) => setForm({ ...form, interest: e.target.value })}
        className="text-sm bg-background/60 border-border/50 resize-none"
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full gradient-primary text-primary-foreground text-sm"
      >
        {loading ? "Отправляем..." : <><Send className="w-3.5 h-3.5 mr-1.5" />Отправить заявку</>}
      </Button>
    </motion.form>
  );
};

// ─── Основной компонент ───────────────────────────────────────────────────────
const AIChatAssistant = () => {
  const location = useLocation();
  const ctx = getPageContext(location.pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formDone, setFormDone] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: ctx.greeting, sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Сброс при смене страницы
  useEffect(() => {
    const newCtx = getPageContext(location.pathname);
    setMessages([{ id: 0, text: newCtx.greeting, sender: "bot" }]);
    setShowPromo(false);
    setPromoDismissed(false);
    setShowForm(false);
    setFormDone(false);
    setIsOpen(false);
  }, [location.pathname]);

  // Промо-пузырь через 7 секунд
  useEffect(() => {
    if (promoDismissed || isOpen) return;
    const timer = setTimeout(() => setShowPromo(true), 7000);
    return () => clearTimeout(timer);
  }, [location.pathname, promoDismissed, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showForm]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: findResponse(userInput, ctx.topic),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handlePromoClick = () => {
    setShowPromo(false);
    setPromoDismissed(true);
    setIsOpen(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setFormDone(true);
    const successMsg: Message = {
      id: Date.now(),
      text: "Заявка получена! 🎉 Наш менеджер свяжется с вами в течение 24 часов. Спасибо за интерес к Psytix!",
      sender: "bot",
    };
    setMessages((prev) => [...prev, successMsg]);
  };

  return (
    <>
      {/* Промо-пузырь */}
      <AnimatePresence>
        {showPromo && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={handlePromoClick}
            className="fixed bottom-24 right-6 z-50 w-72 glass-card rounded-2xl p-4 shadow-xl border border-primary/30 cursor-pointer hover:border-primary/60 transition-colors"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setShowPromo(false); setPromoDismissed(true); }}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3 pr-4">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">{ctx.promoText}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{ctx.promoSubtext}</p>
                <p className="text-xs text-primary mt-1.5 font-medium">Нажмите, чтобы написать →</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Кнопка чата */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <Button
          onClick={() => { setIsOpen(!isOpen); setShowPromo(false); setPromoDismissed(true); }}
          className="w-14 h-14 rounded-full gradient-primary shadow-glow hover:scale-110 transition-transform"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>

      {/* Окно чата */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] glass-card rounded-2xl shadow-xl flex flex-col overflow-hidden"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Заголовок */}
            <div className="gradient-primary px-5 py-4 flex items-center gap-3 flex-shrink-0">
              <Bot className="w-6 h-6 text-primary-foreground" />
              <div>
                <p className="text-sm font-semibold text-primary-foreground">AI-ассистент Psytix</p>
                <p className="text-xs text-primary-foreground/70">Онлайн · отвечает мгновенно</p>
              </div>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-foreground rounded-bl-none"
                  }`}>
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {/* Форма внутри чата */}
              {showForm && !formDone && (
                <div className="bg-secondary/60 rounded-xl p-3">
                  <p className="text-xs font-semibold text-foreground mb-2">📋 Заявка на обучение</p>
                  <LeadFormInChat
                    defaultInterest={ctx.formInterest}
                    onSuccess={handleFormSuccess}
                  />
                </div>
              )}

              {formDone && (
                <div className="flex items-center gap-2 text-green-400 text-sm p-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Заявка отправлена!</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Кнопка заявки */}
            {!formDone && (
              <div className="px-3 pt-2 pb-1 flex-shrink-0">
                <Button
                  onClick={() => setShowForm(!showForm)}
                  variant="outline"
                  className="w-full text-xs border-primary/40 text-primary hover:bg-primary/10 gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {showForm ? "Скрыть форму" : "Оставить заявку"}
                </Button>
              </div>
            )}

            {/* Поле ввода */}
            <div className="p-3 border-t border-border flex-shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Напишите вопрос..."
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
