import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { blogPosts } from '@/data/blogData';
import BlogCard from './BlogCard';

const POSTS_PER_PAGE = 9;

type Tab = 'psychology' | 'sales';

const BlogSection = () => {
  const [activeTab, setActiveTab] = useState<Tab>('psychology');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const byCategory = blogPosts
      .filter((p) => p.category === activeTab)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (!search.trim()) return byCategory;
    const q = search.toLowerCase();
    return byCategory.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    );
  }, [activeTab, search]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paged = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <section id="blog" className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Блог</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Исследования, кейсы и практические инсайты на стыке психологии и продаж
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10"
        >
          {/* Tabs */}
          <div className="flex items-center glass-card rounded-xl p-1 gap-1 self-start">
            <button
              onClick={() => { setActiveTab('psychology'); setSearch(''); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === 'psychology'
                  ? 'bg-purple-600/50 text-purple-100 border border-purple-500/60 shadow-[0_0_12px_rgba(147,51,234,0.4)]'
                  : 'text-slate-500 hover:text-purple-300 hover:bg-purple-500/10'
              }`}
            >
              <Brain className={`w-5 h-5 transition-colors duration-200 ${
                activeTab === 'psychology' ? 'text-white' : 'text-slate-500'
              }`} />
              Психология
            </button>
            <button
              onClick={() => { setActiveTab('sales'); setSearch(''); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === 'sales'
                  ? 'bg-blue-600/50 text-blue-100 border border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                  : 'text-slate-500 hover:text-blue-300 hover:bg-blue-500/10'
              }`}
            >
              <TrendingUp className={`w-5 h-5 transition-colors duration-200 ${
                activeTab === 'sales' ? 'text-white' : 'text-slate-500'
              }`} />
              Продажи
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Поиск по статьям..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 bg-background/30 border-border/50 focus:border-primary/50"
            />
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + search + page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {paged.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paged.map((post, i) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    index={i}
                    onStart={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-lg">Ничего не найдено по запросу «{search}»</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mt-10"
          >
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={page === 1}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 bg-background/30 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                  n === page
                    ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(147,51,234,0.3)]'
                    : 'border border-border/50 bg-background/30 text-muted-foreground hover:text-primary hover:border-primary/50'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={page === totalPages}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 bg-background/30 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

    </section>
  );
};

export default BlogSection;
