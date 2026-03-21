import Navbar from "@/components/psytix/Navbar";
import BlogSection from "@/components/psytix/BlogSection";
import Footer from "@/components/psytix/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <BlogSection />
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
