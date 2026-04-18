import Navbar from "@/components/psytix/Navbar";
import Hero from "@/components/psytix/Hero";
import MissionBlock from "@/components/psytix/MissionBlock";
import CourseSection from "@/components/psytix/CourseSection";
import VideoPreview from "@/components/psytix/VideoPreview";
import QuizTest from "@/components/psytix/QuizTest";
import ValueCalculator from "@/components/psytix/ValueCalculator";
import TestimonialPopup from "@/components/psytix/TestimonialPopup";
import Footer from "@/components/psytix/Footer";
import { psychologyBlocks, salesBlocks } from "@/data/courses";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Psytix — Психология и продажи в одной системе</title>
        <meta name="description" content="Образовательная платформа нового поколения. 16 научных модулей по психологии и продажам с реальными метриками, практическими инструментами и измеримым результатом." />
        <meta property="og:title" content="Psytix — Психология и продажи в одной системе" />
        <meta property="og:description" content="16 модулей с научной базой. Когнитивные искажения, эмоциональный интеллект, SPIN-продажи, переговоры и многое другое." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://psytix.ru" />
        <meta property="og:image" content="https://psytix.ru/og-image.svg" />
        <meta property="og:site_name" content="Psytix" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Psytix — Психология и продажи в одной системе" />
        <meta name="twitter:description" content="16 модулей с научной базой для роста в психологии и продажах." />
        <link rel="canonical" href="https://psytix.ru" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Psytix",
          "url": "https://psytix.ru",
          "logo": "https://psytix.ru/favicon.svg",
          "description": "Образовательная платформа по психологии и продажам. 16 научных модулей с реальными метриками и практическими инструментами.",
          "sameAs": [],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "Russian"
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Psytix",
          "url": "https://psytix.ru"
        })}</script>
      </Helmet>
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
      <Footer />

      {/* Overlays */}
      <TestimonialPopup />
    </div>
  );
};

export default Index;
