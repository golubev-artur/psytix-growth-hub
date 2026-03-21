import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

const anchorItems = [
  { label: "Психология", href: "#psychology" },
  { label: "Продажи", href: "#sales" },
  { label: "Видео", href: "#video" },
  { label: "Квиз", href: "#quiz" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome ? "glass-card shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold gradient-text flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Psytix
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {anchorItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ))}
          <Link
            to="/blog"
            className={`text-sm transition-colors ${
              location.pathname === "/blog"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Блог
          </Link>
          <Button
            size="sm"
            className="gradient-primary text-primary-foreground rounded-lg shadow-glow-sm hover:scale-105 transition-transform"
            onClick={() => scrollTo("#quiz")}
          >
            Начать
          </Button>
        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-card border-t border-border"
        >
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-3">
            {anchorItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-sm text-muted-foreground hover:text-foreground py-2 text-left"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/blog"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground py-2"
            >
              Блог
            </Link>
            <Button
              className="gradient-primary text-primary-foreground rounded-lg w-full mt-2"
              onClick={() => scrollTo("#quiz")}
            >
              Начать обучение
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
