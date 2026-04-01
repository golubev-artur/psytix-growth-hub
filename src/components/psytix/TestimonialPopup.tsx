import { motion } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TestimonialPopup = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15, delay: 2 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate("/reviews")}
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-glow cursor-pointer"
      title="Отзывы"
    >
      <ThumbsUp className="w-6 h-6 text-primary-foreground" />
    </motion.button>
  );
};

export default TestimonialPopup;
