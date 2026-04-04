import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts';
import type { BlogPost } from '@/data/blogData';
import { getPostUrl } from '@/data/blogData';

interface BlogCardProps {
  post: BlogPost;
  onStart: () => void;
  index?: number;
}

const MiniChart = ({ post }: { post: BlogPost }) => {
  const firstKey = Object.keys(post.chartData[0]).find((k) => k !== 'name') ?? 'value';
  const color = post.category === 'psychology' ? '#7C3AED' : '#3B82F6';

  if (post.chartType === 'bar') {
    return (
      <BarChart data={post.chartData}>
        <XAxis dataKey="name" hide />
        <Tooltip contentStyle={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#a78bfa' }} />
        <Bar dataKey={firstKey} fill={color} radius={[3, 3, 0, 0]} />
      </BarChart>
    );
  }
  if (post.chartType === 'line') {
    return (
      <LineChart data={post.chartData}>
        <XAxis dataKey="name" hide />
        <Tooltip contentStyle={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#a78bfa' }} />
        <Line type="monotone" dataKey={firstKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    );
  }
  return (
    <AreaChart data={post.chartData}>
      <XAxis dataKey="name" hide />
      <Tooltip contentStyle={{ background: 'rgba(15,15,30,0.9)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#a78bfa' }} />
      <defs>
        <linearGradient id={`grad-${post.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.4} />
          <stop offset="95%" stopColor={color} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey={firstKey} stroke={color} strokeWidth={2} fill={`url(#grad-${post.id})`} />
    </AreaChart>
  );
};

const BlogCard = ({ post, onStart, index = 0 }: BlogCardProps) => {
  const navigate = useNavigate();
  const isPsy = post.category === 'psychology';
  const badgeClass = isPsy
    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
  const badgeLabel = isPsy ? 'Психология' : 'Продажи';

  const formattedDate = new Date(post.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group cursor-pointer"
      onClick={() => navigate(getPostUrl(post))}
    >
      {/* Category badge */}
      <div className="px-5 pt-5">
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}>
          {badgeLabel}
        </span>
      </div>

      {/* Title + excerpt */}
      <div className="px-5 pt-3 pb-2 flex-1">
        <h3 className="text-base font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      </div>

      {/* Mini chart */}
      <div className="mx-5 mb-3 rounded-xl overflow-hidden bg-background/30 border border-border/30">
        <ResponsiveContainer width="100%" height={110}>
          <MiniChart post={post} />
        </ResponsiveContainer>
      </div>

      {/* Meta */}
      <div className="px-5 pb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {post.readTime}
        </span>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5">
        <Button
          size="sm"
          className="w-full text-xs gradient-primary text-primary-foreground shadow-glow-sm hover:scale-105 transition-transform"
          onClick={(e) => { e.stopPropagation(); onStart(); }}
        >
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Начать
        </Button>
      </div>
    </motion.div>
  );
};

export default BlogCard;
