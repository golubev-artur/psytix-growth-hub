import Navbar from "@/components/psytix/Navbar";
import Hero from "@/components/psytix/Hero";
import MissionBlock from "@/components/psytix/MissionBlock";
import CourseSection from "@/components/psytix/CourseSection";
import VideoPreview from "@/components/psytix/VideoPreview";
import QuizTest from "@/components/psytix/QuizTest";
import ValueCalculator from "@/components/psytix/ValueCalculator";
import BlogSection from "@/components/psytix/BlogSection";
import AIChatAssistant from "@/components/psytix/AIChatAssistant";
import TestimonialPopup from "@/components/psytix/TestimonialPopup";
import Footer from "@/components/psytix/Footer";
import { psychologyBlocks, salesBlocks } from "@/data/courses";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <MissionBlock />

      <CourseSection
        title="Модули по психологии"
        subtitle="8 блоков с научной базой для глубокого понимания людей и процессов"
        blocks={psychologyBlocks}
        category="psychology"
      />

      <VideoPreview />

      <CourseSection
        title="Модули по продажам"
        subtitle="8 практических блоков для роста выручки и эффективности команды"
        blocks={salesBlocks}
        category="sales"
      />

      <QuizTest />
      <ValueCalculator />
      <BlogSection />
      <Footer />

      {/* Overlays */}
      <AIChatAssistant />
      <TestimonialPopup />
    </div>
  );
};

export default Index;
