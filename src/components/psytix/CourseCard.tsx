import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import type { CourseBlock } from "@/data/courses";

interface CourseCardProps {
  course: CourseBlock;
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => {
  const Icon = course.icon;
  const BenefitIcon = course.benefitIcon;
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-card rounded-xl overflow-hidden card-3d group cursor-pointer shine gradient-border"
      onClick={() => navigate(`/module/${course.id}`)}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow-sm">
            <Icon className="w-4 h-4 text-primary-foreground" />
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-[10px] px-1.5 py-0.5">
            {course.badgeText}
          </Badge>
        </div>

        {/* Title & Description */}
        <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">
          {course.description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-1.5 mb-2 text-[10px] text-muted-foreground">
          <User className="w-3 h-3" />
          <span>{course.category === 'psychology' ? 'Лозовая М.А.' : 'Голубев А.А.'}</span>
        </div>

        {/* Benefit */}
        <div className="flex items-center gap-1.5 mb-3 p-2 bg-psytix-success/5 rounded-lg border border-psytix-success/10">
          <BenefitIcon className="w-3.5 h-3.5 text-psytix-success flex-shrink-0" />
          <span className="text-xs font-medium text-psytix-success line-clamp-1">{course.benefitText}</span>
        </div>

        {/* CTA Button */}
        <Button
          size="sm"
          className="w-full gradient-primary text-primary-foreground rounded-lg text-xs h-8"
          onClick={(e) => { e.stopPropagation(); navigate(`/module/${course.id}`); }}
        >
          Подробнее
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
