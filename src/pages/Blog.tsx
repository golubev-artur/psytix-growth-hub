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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Блог Psytix — Статьи по психологии и продажам" />
        <meta name="twitter:description" content="Экспертные статьи с графиками и статистикой по психологии и продажам." />
        <meta name="twitter:image" content="https://psytix.ru/og-image.png" />
        <meta property="og:locale" content="ru_RU" />
        <link rel="canonical" href="https://psytix.ru/blog" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Блог Psytix",
          "url": "https://psytix.ru/blog",
          "inLanguage": "ru-RU",
          "publisher": { "@type": "Organization", "name": "Psytix", "url": "https://psytix.ru" }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://psytix.ru" },
            { "@type": "ListItem", "position": 2, "name": "Блог", "item": "https://psytix.ru/blog" }
          ]
        })}</script>
      </Helmet>
      <Navbar />
      <main className="pt-16">
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
