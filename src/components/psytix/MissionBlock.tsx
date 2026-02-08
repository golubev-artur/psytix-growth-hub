import { motion } from "framer-motion";
import { Heart, Lightbulb, TrendingUp } from "lucide-react";

const MissionBlock = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Наша <span className="gradient-text">миссия</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
            Мы помогаем расти через реальное знание психологии и практик продаж
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: Lightbulb,
              title: "Научный подход",
              description: "Каждый модуль основан на рецензированных исследованиях и проверенных методологиях",
            },
            {
              icon: Heart,
              title: "Практика с первого дня",
              description: "Шаблоны, чек-листы и упражнения, которые можно применить сразу после урока",
            },
            {
              icon: TrendingUp,
              title: "Измеримый результат",
              description: "Метрики до/после для каждого модуля — вы видите свой прогресс в цифрах",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-card rounded-2xl p-8 text-center card-3d"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-5">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionBlock;
