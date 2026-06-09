import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, Sparkles, HelpCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const Tooltip = ({ text, visible }: { text: string; visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        className="absolute left-0 right-0 top-full mt-1 z-10 p-2.5 rounded-lg bg-background border border-border shadow-lg text-xs text-muted-foreground leading-relaxed"
      >
        {text}
      </motion.div>
    )}
  </AnimatePresence>
);

const ValueCalculator = () => {
  const [revenue, setRevenue] = useState([500000]);
  const [revenueInput, setRevenueInput] = useState('500000');
  const [teamSize, setTeamSize] = useState([5]);
  const [avgSalary, setAvgSalary] = useState([80000]);
  const [convRate, setConvRate] = useState([15]);

  const revenueValue = revenue[0];
  const teamValue = teamSize[0];
  const salaryValue = avgSalary[0];
  const convValue = convRate[0];

  const handleRevenueSlider = (val: number[]) => {
    setRevenue(val);
    setRevenueInput(String(val[0]));
  };

  const handleRevenueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setRevenueInput(raw);
    const num = Number(raw);
    if (num >= 0 && num <= 3000000000) {
      setRevenue([num]);
    }
  };

  // Calculated improvements
  const convImprovement = convValue * 0.45;
  const revenueGain = revenueValue * (convImprovement / 100);
  const productivityGain = teamValue * salaryValue * 12 * 0.15;
  const totalValue = revenueGain + productivityGain;

  const [tip, setTip] = useState<string | null>(null);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Калькулятор <span className="gradient-text">ценности</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Рассчитайте потенциальный возврат от обучения
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card rounded-2xl p-8 shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-8">
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-foreground">Годовой оборот</label>
                  <button type="button" onClick={() => setTip(tip === 'revenue' ? null : 'revenue')} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                <Tooltip visible={tip === 'revenue'} text="Общая сумма денег, которую ваша компания получает от продаж за год (до вычета расходов). Введите цифру вручную или используйте шкалу." />
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={revenueInput}
                    onChange={handleRevenueInput}
                    className="flex-1 px-3 py-2 rounded-xl bg-background/60 border border-border text-sm font-bold text-foreground focus:outline-none focus:border-primary/50 text-right"
                  />
                  <span className="text-xs text-muted-foreground shrink-0">₽ / год</span>
                </div>
                <p className="text-xs text-primary mb-1 text-right">{formatCurrency(revenueValue)}</p>
                <Slider
                  value={revenue}
                  onValueChange={handleRevenueSlider}
                  min={0}
                  max={3000000000}
                  step={1000000}
                  className="w-full"
                />
              </div>

              <div className="relative">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">Размер команды</label>
                    <button type="button" onClick={() => setTip(tip === 'team' ? null : 'team')} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-primary">{teamValue} чел.</span>
                </div>
                <Tooltip visible={tip === 'team'} text="Количество сотрудников, которые участвуют в продажах и работе с клиентами. Чем больше команда — тем выше суммарный эффект от обучения." />
                <Slider
                  value={teamSize}
                  onValueChange={setTeamSize}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="relative">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">Средняя зарплата</label>
                    <button type="button" onClick={() => setTip(tip === 'salary' ? null : 'salary')} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-primary">{formatCurrency(salaryValue)}</span>
                </div>
                <Tooltip visible={tip === 'salary'} text="Средняя месячная зарплата одного сотрудника отдела продаж. Используется для расчёта экономии от роста продуктивности команды после обучения." />
                <Slider
                  value={avgSalary}
                  onValueChange={setAvgSalary}
                  min={20000}
                  max={250000}
                  step={5000}
                  className="w-full"
                />
              </div>

              <div className="relative">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">Текущая конверсия</label>
                    <button type="button" onClick={() => setTip(tip === 'conv' ? null : 'conv')} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-primary">{convValue}%</span>
                </div>
                <Tooltip visible={tip === 'conv'} text="Процент клиентов, которые совершают покупку из всех обратившихся. Например, если из 100 заявок покупают 15 — конверсия 15%." />
                <Slider
                  value={convRate}
                  onValueChange={setConvRate}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <div className="relative p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-psytix-success" />
                    <span className="text-xs text-muted-foreground">Рост конверсии</span>
                    <button type="button" onClick={() => setTip(tip === 'r-conv' ? null : 'r-conv')} className="ml-auto text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {convValue}% → {(convValue + convImprovement).toFixed(1)}%
                  </p>
                  <Tooltip visible={tip === 'r-conv'} text="Прогнозируемый рост конверсии на 45% от текущего уровня. Основано на средних результатах компаний после обучения психологии продаж и переговоров." />
                </div>

                <div className="relative p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Calculator className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Доп. выручка / год</span>
                    <button type="button" onClick={() => setTip(tip === 'r-rev' ? null : 'r-rev')} className="ml-auto text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(revenueGain)}</p>
                  <Tooltip visible={tip === 'r-rev'} text="Дополнительная выручка = ваш годовой оборот × прирост конверсии. Это сумма, которую компания может дополнительно заработать за год благодаря повышению эффективности продаж." />
                </div>

                <div className="relative p-5 rounded-xl gradient-primary shadow-glow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary-foreground/70" />
                    <span className="text-xs text-primary-foreground/70">Общая ценность</span>
                    <button type="button" onClick={() => setTip(tip === 'r-total' ? null : 'r-total')} className="ml-auto text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-2xl font-bold text-primary-foreground">
                    {formatCurrency(totalValue)}
                  </p>
                  <p className="text-xs text-primary-foreground/60 mt-1">в год</p>
                  <Tooltip visible={tip === 'r-total'} text="Общая ценность = доп. выручка + рост продуктивности команды. Продуктивность рассчитывается как 15% от годового фонда оплаты труда (сотрудники × зарплата × 12 мес. × 15%)." />
                </div>
              </div>

              <Button className="w-full mt-6 gradient-primary text-primary-foreground py-5 rounded-xl shadow-glow-sm hover:scale-[1.02] transition-transform">
                Получить ROI-отчёт
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueCalculator;
