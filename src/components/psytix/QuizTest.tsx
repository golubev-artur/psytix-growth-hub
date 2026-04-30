import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, RotateCcw, Sparkles, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { quizQuestions, psychologyBlocks, salesBlocks } from "@/data/courses";
import { sendLeadToTelegram } from "@/lib/telegram";

const QuizTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((c) => c + 1), 300);
    } else {
      setTimeout(() => setIsComplete(true), 300);
    }
  };

  const getRecommendations = () => {
    const firstAnswer = answers[0];
    if (firstAnswer === 0) return psychologyBlocks.slice(0, 3);
    if (firstAnswer === 1 || firstAnswer === 3) return salesBlocks.slice(0, 3);
    return [...psychologyBlocks.slice(0, 2), salesBlocks[0]];
  };

  const getQuizSummary = () =>
    quizQuestions.map((q, i) => ({
      question: q.question,
      answer: answers[i] !== undefined ? q.options[answers[i]].text : "—",
    }));

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
    setShowForm(false);
    setSubmitted(false);
    setForm({ name: "", email: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const summary = getQuizSummary();
    const recs = getRecommendations();

    const quizBlock = summary
      .map((s, i) => `   ${i + 1}. ${s.question}\n      → ${s.answer}`)
      .join("\n");

    const recsBlock = recs.map((r) => `   • ${r.title}`).join("\n");

    try {
      await sendLeadToTelegram({
        name: form.name,
        email: form.email,
        page: window.location.href,
        button: "Квиз → Начать обучение",
        quizAnswers: quizBlock,
        recommendations: recsBlock,
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
      setShowForm(false);
      toast.success("Заявка отправлена! Свяжемся с вами в течение 24 часов.");
    }
  };

  const progress = ((currentQuestion + (isComplete ? 1 : 0)) / quizQuestions.length) * 100;
  const recommendations = isComplete ? getRecommendations() : [];
  const quizSummary = isComplete ? getQuizSummary() : [];

  return (
    <section id="quiz" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Найдите свою <span className="gradient-text">траекторию</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            3 вопроса — и мы подберём персональный план обучения
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 shadow-xl"
          >
            {/* Progress bar */}
            <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
              <motion.div
                className="h-full gradient-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs text-muted-foreground mb-2">
                    Вопрос {currentQuestion + 1} из {quizQuestions.length}
                  </p>
                  <h3 className="text-xl font-bold mb-6 text-foreground">
                    {quizQuestions[currentQuestion].question}
                  </h3>
                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="w-full text-left px-5 py-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-foreground">{option.text}</span>
                          <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground/0 group-hover:text-primary transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {submitted ? "Заявка отправлена!" : "Ваша персональная траектория готова!"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {submitted ? "Мы свяжемся с вами в течение 24 часов" : "Рекомендуем начать с этих модулей:"}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {recommendations.map((block) => {
                      const Icon = block.icon;
                      return (
                        <div
                          key={block.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border"
                        >
                          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground">{block.title}</p>
                            <p className="text-xs text-muted-foreground">{block.benefitText}</p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-psytix-success flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>

                  {!submitted && (
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 gradient-primary text-primary-foreground py-5 rounded-xl shadow-glow-sm hover:scale-[1.02] transition-transform"
                        onClick={() => setShowForm(true)}
                      >
                        Начать обучение
                      </Button>
                      <Button
                        variant="outline"
                        onClick={restart}
                        className="px-4 py-5 rounded-xl"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {submitted && (
                    <Button variant="outline" onClick={restart} className="w-full rounded-xl">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Пройти квиз заново
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Форма после квиза */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl p-8 w-full max-w-md relative"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold mb-1">Начать обучение</h3>
              <p className="text-muted-foreground text-sm mb-5">
                Персональный план на основе ваших ответов
              </p>

              {/* Ответы квиза */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-5 space-y-2">
                {quizSummary.map((s, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-muted-foreground">{s.question}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-psytix-success flex-shrink-0" />
                      <span className="font-medium text-foreground">{s.answer}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  required
                  placeholder="Ваше имя *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  required
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-primary text-primary-foreground py-5 rounded-xl shadow-glow-sm"
                >
                  {loading ? "Отправляем..." : <><Send className="w-4 h-4 mr-2" />Отправить заявку</>}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default QuizTest;
