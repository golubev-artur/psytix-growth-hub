import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import MetricsChart from "./MetricsChart";
import CaseSlider from "./CaseSlider";
import type { CourseBlock } from "@/data/courses";

interface CourseCardProps {
  course: CourseBlock;
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => {
  const Icon = course.icon;
  const BenefitIcon = course.benefitIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-card rounded-2xl overflow-hidden card-3d group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-xs">
            {course.badgeText}
          </Badge>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-foreground mb-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Benefit */}
        <div className="flex items-center gap-2 mb-5 p-3 bg-psytix-success/5 rounded-xl border border-psytix-success/10">
          <BenefitIcon className="w-5 h-5 text-psytix-success flex-shrink-0" />
          <span className="text-sm font-medium text-psytix-success">{course.benefitText}</span>
        </div>

        {/* Metrics Chart */}
        <div className="mb-5">
          <MetricsChart
            before={course.metricsBefore}
            after={course.metricsAfter}
            label={course.metricsLabel}
          />
        </div>

        {/* Case Slider */}
        <CaseSlider cases={course.cases} />
      </div>
    </motion.div>
  );
};

export default CourseCard;
