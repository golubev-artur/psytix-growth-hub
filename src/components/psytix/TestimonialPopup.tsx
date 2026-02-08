import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { testimonials } from "@/data/courses";

const TestimonialPopup = () => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setVisible(true);
    }, 8000);

    return () => clearTimeout(showTimeout);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const hideTimeout = setTimeout(() => {
      setVisible(false);
      // Show next after delay
      setTimeout(() => {
        setCurrentIndex((c) => (c + 1) % testimonials.length);
        setVisible(true);
      }, 15000);
    }, 6000);

    return () => clearTimeout(hideTimeout);
  }, [visible, currentIndex]);

  const t = testimonials[currentIndex];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-6 left-6 z-40 max-w-sm glass-card rounded-2xl p-5 shadow-xl"
        >
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary-foreground">
              {t.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-psytix-warning text-psytix-warning" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-2">"{t.text}"</p>
              <div>
                <p className="text-xs font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TestimonialPopup;
