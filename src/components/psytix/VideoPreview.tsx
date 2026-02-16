import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import trainingVideoPart1 from "@/assets/training-video-part1.mp4";
import trainingVideoPart2 from "@/assets/training-video-part2.mp4";

const VideoPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentPart, setCurrentPart] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videos = [trainingVideoPart1, trainingVideoPart2];

  const handleEnded = useCallback(() => {
    if (currentPart < videos.length - 1) {
      const next = currentPart + 1;
      setCurrentPart(next);
      if (videoRef.current) {
        videoRef.current.src = videos[next];
        videoRef.current.play();
      }
    } else {
      setCurrentPart(0);
      if (videoRef.current) {
        videoRef.current.src = videos[0];
      }
      setIsPlaying(false);
    }
  }, [currentPart, videos]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      if (!isPlaying && currentPart === 0) {
        videoRef.current.src = videos[0];
      }
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

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
            Наш эксперт помогает увеличить результативность любой компании
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
            <video
              ref={videoRef}
              src={trainingVideoPart1}
              className="w-full h-full object-cover"
              muted
              playsInline
              onEnded={handleEnded}
            />

            {/* Play/Pause overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: isPlaying ? 0 : 1 }}
              onClick={togglePlay}
            >
              <div className="absolute inset-0 bg-foreground/20" />
              <motion.div
                className="relative w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow z-10"
                whileHover={{ scale: 1.1 }}
                animate={{
                  boxShadow: [
                    "0 0 40px -10px hsl(217 91% 60% / 0.3)",
                    "0 0 60px -10px hsl(217 91% 60% / 0.5)",
                    "0 0 40px -10px hsl(217 91% 60% / 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </motion.div>
            </div>

            {/* Controls when playing */}
            {isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                >
                  <Pause className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                  onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoPreview;
