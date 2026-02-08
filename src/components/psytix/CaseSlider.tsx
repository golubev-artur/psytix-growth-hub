import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/data/courses";

interface CaseSliderProps {
  cases: CaseStudy[];
}

const CaseSlider = ({ cases }: CaseSliderProps) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % cases.length);
  const prev = () => setCurrent((c) => (c - 1 + cases.length) % cases.length);

  const c = cases[current];

  return (
    <div className="relative">
      <div className="bg-secondary/50 rounded-xl p-4 min-h-[120px]">
        <Quote className="w-4 h-4 text-primary/40 mb-2" />
        <p className="text-sm text-foreground/80 italic mb-3 line-clamp-2">"{c.quote}"</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.role}</p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
            {c.result}
          </span>
        </div>
      </div>
      {cases.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prev}>
            <ChevronLeft className="w-3 h-3" />
          </Button>
          {cases.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === current ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={next}>
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CaseSlider;
