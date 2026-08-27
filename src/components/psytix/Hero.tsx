import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowDown, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnimatedCounter, useTypewriter } from "@/hooks/useAnimatedCounter";

const ORBS = [
  { size: 288, top: "8%",  left: "8%",  color: "primary", x: 30,  y: -20, dur: 8  },
  { size: 384, bottom: "8%", right: "8%", color: "accent",  x: -25, y: 25,  dur: 10 },
  { size: 192, top: "38%", right: "28%", color: "psytix-violet", x: 15, y: -15, dur: 6 },
  { size: 160, top: "60%", left: "25%",  color: "psytix-cyan",   x: -10, y: 20, dur: 9 },
  { size: 224, top: "20%", right: "15%", color: "psytix-indigo", x: 20, y: 10,  dur: 7 },
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 8,
  duration: Math.random() * 10 + 12,
  opacity: Math.random() * 0.4 + 0.1,
}));

function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const { value: count, ref } = useAnimatedCounter(value, 1600);
  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl md:text-3xl font-bold gradient-text tabular-nums">
        {count.toLocaleString("ru-RU")}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true });

  const typeText = useTypewriter(
    ["Психология и продажи в одной системе", "Рост через реальное знание", "Наука на службе результата"],
    55,
    2400
  );

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">

      {/* Плавающие орбы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-${orb.color}/5 blur-3xl`}
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              bottom: (orb as any).bottom,
              right: (orb as any).right,
            }}
            animate={{ x: [0, orb.x, 0], y: [0, orb.y, 0] }}
            transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Частицы */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              bottom: -10,
              opacity: p.opacity,
            }}
            animate={{ y: [0, -window.innerHeight - 100], opacity: [0, p.opacity, p.opacity, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Сетка точек */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Бейдж */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-foreground/80">
              Образовательная платформа нового поколения
            </span>
          </motion.div>

          {/* Заголовок */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="gradient-text">Psytix</span>
            <span className="sr-only"> — обучение психологии и продажам</span>
          </motion.h1>

          {/* Typewriter подзаголовок */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto min-h-[2em]"
          >
            {typeText}
            <span className="typewriter-cursor" />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground/70 mb-10 max-w-xl mx-auto"
          >
            16 модулей с научной базой, реальными метриками и практическими инструментами для роста
          </motion.p>

          {/* Кнопки */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="pulse-ring rounded-xl"
            >
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-glow hover:shadow-glow transition-all duration-300"
                onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Начать обучение
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg rounded-xl glass border-primary/20 hover:border-primary/50 transition-all duration-300"
                onClick={() => document.getElementById("video")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play className="w-5 h-5 mr-2" />
                Смотреть видео
              </Button>
            </motion.div>
          </motion.div>

          {/* Анимированные счётчики */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"
          >
            <StatCounter value={16} label="модулей" />
            <StatCounter value={2000} suffix="+" label="студентов" />
            <StatCounter value={94} suffix="%" label="результат" />
          </motion.div>
        </div>
      </div>

      {/* Индикатор скролла */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs text-muted-foreground/40 tracking-widest uppercase">scroll</span>
        <ArrowDown className="w-5 h-5 text-muted-foreground/40" />
      </motion.div>
    </section>
  );
};

export default Hero;
