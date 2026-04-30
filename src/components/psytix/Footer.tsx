import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { sendLeadToTelegram } from "@/lib/telegram";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sendLeadToTelegram({
      name: "—",
      email,
      page: window.location.href,
      button: "Footer → Начать (email)",
    });
    setSubmitted(true);
    toast.success("Заявка отправлена! Свяжемся с вами в течение 24 часов.");
  };

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

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-psytix-success py-5">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Заявка отправлена — свяжемся в течение 24 часов!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <Input
                required
                type="email"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-5 rounded-xl bg-background/80 border-border"
              />
              <Button type="submit" className="gradient-primary text-primary-foreground px-8 py-5 rounded-xl shadow-glow-sm hover:scale-[1.02] transition-transform">
                Начать
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
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
