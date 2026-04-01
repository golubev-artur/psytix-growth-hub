import Navbar from "@/components/psytix/Navbar";
import BlogSection from "@/components/psytix/BlogSection";
import Footer from "@/components/psytix/Footer";
import { Helmet } from "react-helmet-async";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Блог Psytix — Статьи по психологии и продажам</title>
        <meta name="description" content="Экспертные статьи о психологии влияния, когнитивных искажениях, техниках продаж и эмоциональном интеллекте. Данные, графики, реальные кейсы." />
        <meta property="og:title" content="Блог Psytix — Статьи по психологии и продажам" />
        <meta property="og:description" content="Экспертные статьи с графиками и статистикой по психологии и продажам." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://psytix.ru/blog" />
        <meta property="og:image" content="https://psytix.ru/og-image.png" />
        <meta property="og:site_name" content="Psytix" />
        <link rel="canonical" href="https://psytix.ru/blog" />
      </Helmet>
      <Navbar />
      <div className="pt-16">
        <BlogSection />
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
