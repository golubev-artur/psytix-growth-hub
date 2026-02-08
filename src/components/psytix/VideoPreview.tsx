import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="video" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Посмотрите, как <span className="gradient-text">это работает</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            2 минуты, которые изменят ваш подход к обучению
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-xl glass-card aspect-video group cursor-pointer">
            {isPlaying ? (
              <div className="relative w-full h-full bg-foreground/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-4">Видео-превью загружается...</p>
                    <p className="text-sm text-muted-foreground/60">Здесь будет ваше промо-видео</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-foreground/10 hover:bg-foreground/20 rounded-full"
                  onClick={() => setIsPlaying(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div
                className="w-full h-full gradient-hero flex items-center justify-center"
                onClick={() => setIsPlaying(true)}
              >
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
                  backgroundSize: "40px 40px"
                }} />
                
                <div className="relative text-center">
                  <motion.div
                    className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow"
                    whileHover={{ scale: 1.1 }}
                    animate={{ boxShadow: [
                      "0 0 40px -10px hsl(217 91% 60% / 0.3)",
                      "0 0 60px -10px hsl(217 91% 60% / 0.5)",
                      "0 0 40px -10px hsl(217 91% 60% / 0.3)",
                    ]}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </motion.div>
                  <p className="text-foreground font-semibold text-lg">Смотреть презентацию</p>
                  <p className="text-muted-foreground text-sm mt-1">2:30 · Обзор платформы</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoPreview;
