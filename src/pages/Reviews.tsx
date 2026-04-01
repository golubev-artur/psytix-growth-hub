import { Star } from "lucide-react";
import { testimonials } from "@/data/courses";
import Navbar from "@/components/psytix/Navbar";
import Footer from "@/components/psytix/Footer";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const Reviews = () => {
  return (
    <>
      <Helmet>
        <title>Отзывы — Psytix</title>
        <meta name="description" content="Отзывы студентов платформы Psytix. Реальные результаты обучения психологии и продажам." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-4"
          >
            Отзывы
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Что говорят наши студенты о платформе Psytix
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-psytix-warning text-psytix-warning" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Reviews;
