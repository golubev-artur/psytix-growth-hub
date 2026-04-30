import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendLeadToTelegram } from "@/lib/telegram";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Clock, Users, Award, TrendingUp } from "lucide-react";
import { psychologyBlocks, salesBlocks } from "@/data/courses";
import { moduleDetails } from "@/data/moduleDetails";
import Navbar from "@/components/psytix/Navbar";
import Footer from "@/components/psytix/Footer";
import { Helmet } from "react-helmet-async";

const ModulePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const allCourses = [...psychologyBlocks, ...salesBlocks];
  const course = allCourses.find((c) => c.id === id);
  const detail = id ? moduleDetails[id] : undefined;

  if (!course || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Модуль не найден</h2>
          <Button onClick={() => navigate("/")}>На главную</Button>
        </div>
      </div>
    );
  }

  const Icon = course.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendLeadToTelegram({
      name: formData.name,
      email: formData.email,
      comment: formData.comment,
      page: window.location.href,
      button: `Начать обучение — ${course?.title ?? id}`,
    });
    setSubmitted(true);
    setFormOpen(false);
  };

  const categoryLabel = course.category === "psychology" ? "Психология" : "Продажи";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{course.title} — {categoryLabel} | Psytix</title>
        <meta name="description" content={`${course.description} Узнайте этапы обучения, реальные кейсы и статистику результатов. ${course.benefitText}.`} />
        <meta property="og:title" content={`${course.title} | Psytix`} />
        <meta property="og:description" content={course.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://psytix.ru/module/${id}`} />
        <meta property="og:image" content="https://psytix.ru/og-image.png" />
        <meta property="og:site_name" content="Psytix" />
        <link rel="canonical" href={`https://psytix.ru/module/${id}`} />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
                {course.badgeText}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {course.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              {detail.fullDescription}
            </p>

            {/* Key Facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {detail.keyFacts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="glass-card rounded-xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-primary mb-1">{fact.value}</div>
                  <div className="text-xs text-muted-foreground">{fact.label}</div>
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              className="gradient-primary text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-glow hover:shadow-glow-lg transition-all"
              onClick={() => setFormOpen(true)}
            >
              Начать обучение
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      {formOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-2xl p-8 w-full max-w-md"
          >
            <h3 className="text-2xl font-bold mb-2">Записаться на модуль</h3>
            <p className="text-muted-foreground mb-6">«{course.title}»</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Ваше имя *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Email *"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Textarea
                placeholder="Комментарий (необязательно)"
                rows={3}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 gradient-primary text-primary-foreground">
                  Отправить заявку
                </Button>
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setSubmitted(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card rounded-2xl p-8 w-full max-w-md text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-psytix-success mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
            <p className="text-muted-foreground mb-6">Мы свяжемся с вами в течение 24 часов.</p>
            <Button onClick={() => setSubmitted(false)} className="gradient-primary text-primary-foreground">
              Закрыть
            </Button>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* Learning Stages */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">Этапы обучения</h2>
            <p className="text-muted-foreground mb-8">Структурированная программа от теории к практике</p>

            <div className="space-y-4">
              {detail.stages.map((stage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                      {stage.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{stage.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {stage.duration}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {stage.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {stage.skills.map((skill, j) => (
                          <span
                            key={j}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-psytix-success">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Результат: {stage.outcome}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Progress Chart */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">Динамика роста</h2>
            <p className="text-muted-foreground mb-8">Ваш прогресс vs средний уровень по рынку</p>

            <div className="glass-card rounded-2xl p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={detail.progressData}>
                  <defs>
                    <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#888", fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: "rgba(20,20,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="уровень"
                    name="Уровень после Psytix"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    fill="url(#colorLevel)"
                  />
                  <Area
                    type="monotone"
                    dataKey="среднийПоРынку"
                    name="Средний по рынку"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#colorMarket)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>

        {/* Result Stats Chart */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">Результаты в цифрах</h2>
            <p className="text-muted-foreground mb-8">Сравнение показателей до и после обучения</p>

            <div className="glass-card rounded-2xl p-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={detail.resultStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: "#888", fontSize: 12 }} domain={[0, 110]} />
                  <YAxis type="category" dataKey="name" width={180} tick={{ fill: "#ccc", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: "rgba(20,20,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  />
                  <Legend />
                  <Bar dataKey="до" name="До обучения" fill="#334155" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="после" name="После обучения" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>

        {/* Who is for + What you get */}
        <section className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Для кого</h2>
            </div>
            <ul className="space-y-3">
              {detail.whoIsFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-psytix-success flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Что вы получите</h2>
            </div>
            <ul className="space-y-3">
              {detail.whatYouGet.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* FAQ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8">Частые вопросы</h2>
            <div className="space-y-3">
              {detail.faq.map((item, i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium">{item.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-10 text-center gradient-hero"
          >
            <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Оставьте заявку — мы свяжемся с вами в течение 24 часов и ответим на все вопросы.
            </p>
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground px-10 py-6 text-lg rounded-xl shadow-glow hover:shadow-glow-lg transition-all"
              onClick={() => setFormOpen(true)}
            >
              Начать
            </Button>
          </motion.div>
        </section>

      </div>

      <Footer />
    </div>
  );
};

export default ModulePage;
