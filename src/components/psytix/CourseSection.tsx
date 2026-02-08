import { motion } from "framer-motion";
import { Brain, TrendingUp } from "lucide-react";
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blocks.map((block, index) => (
            <CourseCard key={block.id} course={block} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
