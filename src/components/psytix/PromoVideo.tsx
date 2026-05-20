import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Sparkles } from "lucide-react";

const PromoVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  };

  return (
    <section id="video" className="py-24 relative overflow-hidden">
      {/* Фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">За 30 секунд о главном</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Почему выбирают <span className="gradient-text">Psytix</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Реальные результаты студентов — в цифрах
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-4xl mx-auto relative group cursor-pointer gradient-border shine"
          onClick={toggle}
        >
          <div className="rounded-2xl overflow-hidden shadow-glow ring-1 ring-primary/20">
            <video
              ref={videoRef}
              src="/promo.mp4"
              className="w-full"
              playsInline
              onEnded={() => setPlaying(false)}
            />
          </div>

          {/* Play/Pause кнопка */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 rounded-2xl ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow pulse-ring"
            >
              {playing
                ? <Pause className="w-9 h-9 text-white" />
                : <Play  className="w-9 h-9 text-white ml-1" />
              }
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoVideo;
