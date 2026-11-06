import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/psytix/CookieBanner";
import AIChatAssistant from "./components/psytix/AIChatAssistant";

const Blog = lazy(() => import("./pages/Blog"));
const ModulePage = lazy(() => import("./pages/ModulePage"));
const Reviews = lazy(() => import("./pages/Reviews"));
const BlogPostPage = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Specialist = lazy(() => import("./pages/Specialist"));
const Golubev = lazy(() => import("./pages/Golubev"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <CookieBanner />
        <AIChatAssistant />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/psy/:slug" element={<BlogPostPage />} />
            <Route path="/blog/sal/:slug" element={<BlogPostPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/module/:id" element={<ModulePage />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/mariyalozovaya" element={<Specialist />} />
            <Route path="/arturgolubev" element={<Golubev />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
