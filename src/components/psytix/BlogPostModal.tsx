import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, BookOpen, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import type { BlogPost } from '@/data/blogData';
import { getRelatedPosts } from '@/data/blogData';

const CHART_COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

interface BlogPostModalProps {
  post: BlogPost | null;
  open: boolean;
  onClose: () => void;
  onOpenPost: (post: BlogPost) => void;
}

const FullChart = ({ post }: { post: BlogPost }) => {
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
    );
  }
  if (post.chartType === 'line') {
    return (
      <LineChart data={post.chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <Tooltip {...tooltipStyle} />
        {keys.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />}
        {keys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CHART_COLORS[i % CHART_COLORS.length] }}
          />
        ))}
      </LineChart>
    );
  }
  return (
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
        <Area
          key={key}
          type="monotone"
          dataKey={key}
          stroke={CHART_COLORS[i % CHART_COLORS.length]}
          strokeWidth={2.5}
          fill={`url(#fullgrad-${key})`}
        />
      ))}
    </AreaChart>
  );
};

interface FormState {
  name: string;
  email: string;
  phone: string;
  interest: string;
}

const LeadForm = ({ postTitle }: { postTitle: string }) => {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', interest: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate async submit
    await new Promise((r) => setTimeout(r, 800));

    console.log('Blog lead form submission:', { ...form, sourcePost: postTitle });

    setLoading(false);
    setSubmitted(true);
    toast.success('Заявка отправлена! Мы свяжемся с вами в течение 24 часов.');
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 py-6 text-center"
      >
        <CheckCircle2 className="w-12 h-12 text-green-400" />
        <p className="text-lg font-semibold text-foreground">Заявка получена!</p>
        <p className="text-sm text-muted-foreground">Мы свяжемся с вами в течение 24 часов</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Имя *</label>
          <Input
            required
            placeholder="Ваше имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Email *</label>
          <Input
            required
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Телефон</label>
        <Input
          type="tel"
          placeholder="+7 (999) 000-00-00"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="bg-background/50 border-border/50 focus:border-primary/50"
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">
          Что вас интересует больше всего?
        </label>
        <Textarea
          rows={3}
          placeholder="Расскажите о вашей ситуации и задачах..."
          value={form.interest}
          onChange={(e) => setForm({ ...form, interest: e.target.value })}
          className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full gradient-primary text-primary-foreground shadow-glow-sm hover:scale-105 transition-transform"
      >
        {loading ? (
          'Отправляем...'
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Начать обучение
          </>
        )}
      </Button>
    </motion.form>
  );
};

const BlogPostModal = ({ post, open, onClose, onOpenPost }: BlogPostModalProps) => {
  const [showForm, setShowForm] = useState(false);

  if (!post) return null;

  const relatedPosts = getRelatedPosts(post.relatedIds);
  const isPsy = post.category === 'psychology';
  const badgeClass = isPsy
    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30';

  const formattedDate = new Date(post.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const paragraphs = post.content.split('\n\n').filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setShowForm(false); } }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-card border border-border/50 p-0 gap-0">
        {/* Header */}
        <div className="sticky top-0 z-10 glass-card border-b border-border/30 px-6 py-4">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${badgeClass}`}>
                  {isPsy ? 'Психология' : 'Продажи'}
                </span>
                <DialogTitle className="text-lg font-bold text-foreground leading-snug">
                  {post.title}
                </DialogTitle>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-6 mt-4">
          {/* Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4">
            {post.excerpt}
          </p>

          {/* Chart */}
          <div className="rounded-xl overflow-hidden bg-background/30 border border-border/30 p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              {post.chartTitle}
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <FullChart post={post} />
            </ResponsiveContainer>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-sm text-foreground/90 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Связанные материалы</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedPosts.map((related) => {
                  const isRelPsy = related.category === 'psychology';
                  return (
                    <button
                      key={related.id}
                      onClick={() => onOpenPost(related)}
                      className="text-left p-3 rounded-xl border border-border/40 bg-background/20 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5 ${
                        isRelPsy
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {isRelPsy ? 'Психология' : 'Продажи'}
                      </span>
                      <p className="text-xs text-foreground font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {related.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-primary/20 p-5">
            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <h4 className="text-base font-bold text-foreground mb-1">
                    Хотите применить это на практике?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Запишитесь на обучение и начните использовать эти знания уже на следующей неделе
                  </p>
                  <Button
                    className="gradient-primary text-primary-foreground shadow-glow-sm hover:scale-105 transition-transform"
                    onClick={() => setShowForm(true)}
                  >
                    Начать обучение
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <h4 className="text-base font-bold text-foreground mb-3">Оставьте заявку</h4>
                  <LeadForm postTitle={post.title} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostModal;
