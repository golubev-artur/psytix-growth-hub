import { motion } from "framer-motion";
import { Brain, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import type { CourseBlock } from "@/data/courses";

interface CourseSectionProps {
  title: string;
  subtitle: string;
  blocks: CourseBlock[];
  category: "psychology" | "sales";
}

const CourseSection = ({ title, subtitle, blocks, category }: CourseSectionProps) => {
  const SectionIcon = category === "psychology" ? Brain : TrendingUp;
  const navigate = useNavigate();

  return (
    <section className="py-20" id={category}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <SectionIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">
              {category === "psychology" ? "Психология" : "Продажи"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {category === "psychology" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-xl p-5 mb-8 cursor-pointer hover:border-primary/50 transition-colors gradient-border"
            onClick={() => navigate("/mariyalozovaya")}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-primary/30">
                <img src="/specialist-photo.jpg" alt="Мария Лозовая" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary font-medium">Клинический психолог</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Мария Лозовая</h3>
                <p className="text-xs text-muted-foreground">Автор модулей по психологии. КПТ, гипнотерапия, гештальт. Более 2 500 часов практики.</p>
              </div>
              <div className="shrink-0 hidden md:block">
                <span className="text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors">Подробнее</span>
              </div>
            </div>
          </motion.div>
        )}

        {category === "sales" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-xl p-5 mb-8 cursor-pointer hover:border-primary/50 transition-colors gradient-border"
            onClick={() => navigate("/arturgolubev")}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-primary/30">
                <img src="/golubev-photo.jpg" alt="Артур Голубев" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary font-medium">Основатель ГОЛУБЕВ КОНСАЛТИНГ</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Артур Голубев</h3>
                <p className="text-xs text-muted-foreground">Автор модулей по продажам. Эксперт по построению отделов продаж и масштабированию бизнеса.</p>
              </div>
              <div className="shrink-0 hidden md:block">
                <span className="text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors">Подробнее</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {blocks.map((block, index) => (
            <CourseCard key={block.id} course={block} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
