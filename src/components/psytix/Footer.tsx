import { motion } from "framer-motion";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="container mx-auto px-6 relative z-10">
        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Готовы <span className="gradient-text">расти</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Присоединяйтесь к 2000+ профессионалов, которые уже прокачали свои навыки с Psytix
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <Input
              placeholder="Ваш email"
              className="flex-1 py-5 rounded-xl bg-background/80 border-border"
            />
            <Button className="gradient-primary text-primary-foreground px-8 py-5 rounded-xl shadow-glow-sm hover:scale-[1.02] transition-transform">
              Начать
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Бесплатный доступ к первому модулю. Без спама.
          </p>
        </motion.div>

        {/* Footer bottom */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold gradient-text">Psytix</span>
              <span className="text-sm text-muted-foreground">
                © 2025 Все права защищены
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                О проекте
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Модули
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Контакты
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
