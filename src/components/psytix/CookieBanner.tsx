import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies_accepted');
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies_accepted', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border/50 shadow-lg"
        >
          <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Пользуясь нашим сайтом, вы соглашаетесь с тем, что мы используем cookies и с{' '}
              <Link
                to="/privacy"
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                политикой обработки персональных данных
              </Link>
              .
            </p>
            <button
              onClick={handleAccept}
              className="shrink-0 px-5 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Ознакомился
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
