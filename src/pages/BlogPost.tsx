import { useState } from 'react';
import { sendLeadToTelegram } from '@/lib/telegram';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, BookOpen, Send, CheckCircle2, ArrowLeft, Sparkles, Brain, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { blogPosts, getRelatedPosts, getPostUrl } from '@/data/blogData';
import type { BlogPost as BlogPostType } from '@/data/blogData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/psytix/Navbar';
import Footer from '@/components/psytix/Footer';

const CHART_COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const FullChart = ({ post }: { post: BlogPostType }) => {
  const keys = Object.keys(post.chartData[0]).filter((k) => k !== 'name');
  const tooltipStyle = {
    contentStyle: {
      background: 'rgba(15,15,30,0.95)',
      border: '1px solid rgba(124,58,237,0.4)',
      borderRadius: 10,
      fontSize: 12,
    },
    labelStyle: { color: '#a78bfa', fontWeight: 600 },
  };

  if (post.chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={post.chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip {...tooltipStyle} />
          {keys.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />}
          {keys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (post.chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={post.chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip {...tooltipStyle} />
          {keys.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />}
          {keys.map((key, i) => (
            <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS[i % CHART_COLORS.length] }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={post.chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <Tooltip {...tooltipStyle} />
        {keys.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />}
        <defs>
          {keys.map((key, i) => (
            <linearGradient key={key} id={`fullgrad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.5} />
              <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.0} />
            </linearGradient>
          ))}
        </defs>
        {keys.map((key, i) => (
          <Area key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2.5} fill={`url(#fullgrad-${key})`} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

const LeadForm = ({ postTitle }: { postTitle: string }) => {
  const [form, setForm] = useState({ name: '', email: '', interest: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendLeadToTelegram({
        name: form.name,
        email: form.email,
        interest: form.interest,
        page: window.location.href,
        button: `Начать обучение — статья «${postTitle}»`,
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
      toast.success('Заявка отправлена! Мы свяжемся с вами в течение 24 часов.');
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-400" />
        <p className="text-lg font-semibold text-foreground">Заявка получена!</p>
        <p className="text-sm text-muted-foreground">Мы свяжемся с вами в течение 24 часов</p>
      </motion.div>
    );
  }

  return (
    <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Имя *</label>
          <Input required placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-background/50 border-border/50 focus:border-primary/50" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Email *</label>
          <Input required type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-background/50 border-border/50 focus:border-primary/50" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Что вас интересует больше всего?</label>
        <Textarea rows={3} placeholder="Расскажите о вашей ситуации и задачах..." value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} className="bg-background/50 border-border/50 focus:border-primary/50 resize-none" />
      </div>
      <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow-sm hover:scale-105 transition-transform">
        {loading ? 'Отправляем...' : (<><Send className="w-4 h-4 mr-2" />Начать обучение</>)}
      </Button>
    </motion.form>
  );
};

const BlogPostPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const post = slug
    ? blogPosts.find((p) => p.slug === slug)
    : blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Пост не найден</h1>
          <Button onClick={() => navigate('/blog')}>Вернуться в блог</Button>
        </div>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post.relatedIds);
  const isPsy = post.category === 'psychology';
  const badgeClass = isPsy
    ? 'bg-purple-600/40 text-purple-100 border border-purple-500/70 font-bold shadow-[0_0_8px_rgba(147,51,234,0.3)]'
    : 'bg-blue-600/40 text-blue-100 border border-blue-500/70 font-bold shadow-[0_0_8px_rgba(59,130,246,0.3)]';

  const formattedDate = new Date(post.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const paragraphs = post.content.split('\n\n').filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{post.title} — Psytix</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} — Psytix`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://psytix.ru${getPostUrl(post)}`} />
        <meta property="og:image" content="https://psytix.ru/og-image.svg" />
        <meta property="og:site_name" content="Psytix" />
        <meta property="article:published_time" content={post.date} />
        <link rel="canonical" href={`https://psytix.ru${getPostUrl(post)}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": post.date,
          "url": `https://psytix.ru${getPostUrl(post)}`,
          "image": "https://psytix.ru/og-image.svg",
          "publisher": {
            "@type": "Organization",
            "name": "Psytix",
            "logo": {
              "@type": "ImageObject",
              "url": "https://psytix.ru/favicon.svg"
            }
          },
          "author": {
            "@type": "Organization",
            "name": "Psytix"
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://psytix.ru" },
            { "@type": "ListItem", "position": 2, "name": "Блог", "item": "https://psytix.ru/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://psytix.ru${getPostUrl(post)}` }
          ]
        })}</script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={() => navigate('/blog')} className="mb-6 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Назад в блог
          </Button>

          {/* Badge + Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full mb-3 ${badgeClass}`}>
              {isPsy ? <Brain className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {isPsy ? 'Психология' : 'Продажи'}
            </span>
            <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formattedDate}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span>
            </div>
          </motion.div>

          {/* Excerpt */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4 mb-8">
            {post.excerpt}
          </motion.p>

          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl overflow-hidden bg-background/30 border border-border/30 p-4 mb-8">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">{post.chartTitle}</p>
            <FullChart post={post} />
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4 mb-10">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed">{para}</p>
            ))}
          </motion.div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Связанные материалы</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedPosts.map((related) => {
                  const isRelPsy = related.category === 'psychology';
                  return (
                    <Link key={related.id} to={getPostUrl(related)} className="text-left p-3 rounded-xl border border-border/40 bg-background/20 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full mb-1.5 ${isRelPsy ? 'bg-purple-600/40 text-purple-100 border border-purple-500/70 font-bold' : 'bg-blue-600/40 text-blue-100 border border-blue-500/70 font-bold'}`}>
                        {isRelPsy ? <Brain className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {isRelPsy ? 'Психология' : 'Продажи'}
                      </span>
                      <p className="text-xs text-foreground font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">{related.title}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-primary/20 p-6">
            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <h4 className="text-lg font-bold text-foreground mb-1">Хотите применить это на практике?</h4>
                  <p className="text-sm text-muted-foreground mb-4">Запишитесь на обучение и начните использовать эти знания уже на следующей неделе</p>
                  <Button className="gradient-primary text-primary-foreground shadow-glow-sm hover:scale-105 transition-transform" onClick={() => setShowForm(true)}>
                    <Sparkles className="w-4 h-4 mr-2" />Начать обучение
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h4 className="text-base font-bold text-foreground mb-3">Оставьте заявку</h4>
                  <LeadForm postTitle={post.title} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPostPage;
