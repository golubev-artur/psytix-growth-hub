import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quizQuestions, psychologyBlocks, salesBlocks } from "@/data/courses";

const QuizTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

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

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
  };

  const progress = ((currentQuestion + (isComplete ? 1 : 0)) / quizQuestions.length) * 100;

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
                      Ваша персональная траектория готова!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Рекомендуем начать с этих модулей:
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {getRecommendations().map((block, i) => {
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

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 gradient-primary text-primary-foreground py-5 rounded-xl shadow-glow-sm hover:scale-[1.02] transition-transform"
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuizTest;
