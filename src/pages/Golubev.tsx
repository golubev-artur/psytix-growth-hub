import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, Heart, Brain, Users, MapPin, Clock, CheckCircle2, BookOpen, Star, CalendarCheck, Send, MessageCircle, TrendingUp, Settings, BarChart3, Target, Cpu, HeartHandshake, Presentation } from 'lucide-react';
import Navbar from '@/components/psytix/Navbar';
import Footer from '@/components/psytix/Footer';
import { sendLeadToTelegram } from '@/lib/telegram';

const education = [
  { year: '', title: 'МИРЭА — Российский технологический университет', desc: 'Факультет кибернетики' },
  { year: '', title: 'УРАО — Университет Российской академии образования', desc: 'Факультет экономики и бизнеса' },
];

const expertise = [
  { icon: TrendingUp, title: 'Продажи и CRM', desc: 'Аудит отдела продаж, воронки, CRM, скрипты, KPI, мотивация' },
  { icon: Settings, title: 'Бизнес-процессы', desc: 'Описание, оптимизация, регламенты, контроль качества' },
  { icon: BarChart3, title: 'Маркетинг', desc: 'Стратегия, аналитика, позиционирование, рекламные каналы' },
  { icon: Target, title: 'Управление и стратегия', desc: 'OKR, управленческая отчётность, финмодель, антикризис' },
  { icon: Users, title: 'Персонал и команда', desc: 'Найм, оценка, корпкультура, обучение, кадровый резерв' },
  { icon: Cpu, title: 'Технологии и автоматизация', desc: 'IT-аудит, интеграции, ИИ-инструменты, телефония' },
  { icon: HeartHandshake, title: 'Клиентский сервис', desc: 'CJM, стандарты обслуживания, NPS, программы лояльности' },
  { icon: Presentation, title: 'Стратегические сессии', desc: 'Фасилитация, командная синхронизация, план действий' },
];

const salesTopics = [
  'Построение отдела продаж с нуля',
  'SPIN-продажи и работа с возражениями',
  'Холодные звонки и лидогенерация',
  'Up-sell, cross-sell, повышение среднего чека',
  'CRM-аналитика и метрики эффективности',
  'Воронка продаж и оптимизация конверсии',
  'Переговоры о цене и тактики закрытия сделок',
  'Автоматизация процессов продаж',
  'Сегментация клиентов и персонализация',
  'Построение системы мотивации менеджеров',
];

const consultingTopics = [
  'Системный аудит бизнеса — выявление точек роста',
  'Разработка стратегии развития на 1–3 года',
  'Оптимизация бизнес-процессов и регламенты',
  'Внедрение OKR и системы управления по целям',
  'Построение управленческой отчётности и дашбордов',
  'Автоматизация рутинных процессов',
  'Подбор и внедрение IT-решений',
  'Антикризисный консалтинг и стабилизация',
];

const Golubev = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', messenger: '' as '' | 'telegram' | 'max', messengerContact: '', comment: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendLeadToTelegram({
      name: form.name,
      email: form.email,
      comment: form.comment || undefined,
      messenger: form.messenger === 'telegram' ? 'Telegram' : form.messenger === 'max' ? 'MAX' : undefined,
      messengerContact: form.messengerContact || undefined,
      page: window.location.href,
      button: 'Записаться на бесплатную консультацию — Голубев А.А.',
    });
    setSubmitted(true);
    setFormOpen(false);
  };

  return (
  <>
    <Helmet>
      <title>Артур Голубев — Бизнес-консультант, эксперт по продажам | Psytix</title>
      <meta name="description" content="Артур Голубев — бизнес-консультант с 12+ годами опыта. 150+ проектов, 87 клиентов. Системный консалтинг: продажи, маркетинг, бизнес-процессы, автоматизация. Обучение продажам и управлению." />
      <meta name="keywords" content="Артур Голубев, Голубев Артур Артурович, бизнес-консультант, эксперт по продажам, консалтинг продажи, обучение продажам, бизнес-тренер, консалтинг Москва" />
      <link rel="canonical" href="https://psytix.ru/arturgolubev" />
      <meta property="og:type" content="profile" />
      <meta property="og:title" content="Артур Голубев — Бизнес-консультант, эксперт по продажам" />
      <meta property="og:description" content="Бизнес-консультант с 12+ годами опыта. 150+ проектов. Продажи, маркетинг, бизнес-процессы, автоматизация." />
      <meta property="og:url" content="https://psytix.ru/arturgolubev" />
      <meta property="og:image" content="https://psytix.ru/arturgolubev-photo.jpg" />
      <meta property="og:site_name" content="Psytix" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="profile:first_name" content="Артур" />
      <meta property="profile:last_name" content="Голубев" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Артур Голубев — Бизнес-консультант, эксперт по продажам" />
      <meta name="twitter:description" content="12+ лет опыта, 150+ проектов. Системный консалтинг и обучение продажам." />
      <meta name="twitter:image" content="https://psytix.ru/arturgolubev-photo.jpg" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Артур Голубев",
        "givenName": "Артур",
        "familyName": "Голубев",
        "additionalName": "Артурович",
        "jobTitle": "Бизнес-консультант",
        "description": "Бизнес-консультант с 12+ годами опыта. Системный консалтинг: продажи, маркетинг, бизнес-процессы, управление, автоматизация.",
        "url": "https://psytix.ru/arturgolubev",
        "image": "https://psytix.ru/arturgolubev-photo.jpg",
        "sameAs": ["https://golubev-consulting.ru"],
        "alumniOf": [
          { "@type": "CollegeOrUniversity", "name": "МИРЭА — Российский технологический университет" },
          { "@type": "CollegeOrUniversity", "name": "УРАО — Университет Российской академии образования" }
        ],
        "knowsAbout": ["Продажи", "CRM", "Бизнес-процессы", "Маркетинг", "Управление", "OKR", "Автоматизация", "Клиентский сервис", "Стратегия"],
        "worksFor": { "@type": "Organization", "name": "ГОЛУБЕВ КОНСАЛТИНГ" }
      })}</script>
    </Helmet>
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">

        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-16">
          <div className="shrink-0">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-primary/30 overflow-hidden flex items-center justify-center">
              <img src="/golubev-photo.jpg" alt="Артур Голубев" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-sm text-blue-400 font-semibold uppercase tracking-wider mb-1">Бизнес-консультант</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Артур Голубев</h1>
            <p className="text-muted-foreground text-sm mb-4">Основатель ГОЛУБЕВ КОНСАЛТИНГ</p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Помогаю собственникам бизнеса выстроить системные продажи, навести порядок в процессах, маркетинге и управлении. Не просто консультирую — внедряю решения и довожу до результата.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Продажи', 'CRM', 'Маркетинг', 'Бизнес-процессы', 'OKR', 'Автоматизация'].map((m) => (
                <span key={m} className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-200 border border-blue-500/30 font-medium">{m}</span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Clock, label: 'Лет опыта', value: '12+' },
            { icon: Star, label: 'Проектов', value: '150+' },
            { icon: BookOpen, label: 'Направлений', value: '7' },
            { icon: Award, label: 'Клиентов', value: '87' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-card rounded-xl p-4 text-center">
              <Icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.section>

        {/* CTA — Consultation */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <div className="glass-card rounded-2xl p-6 md:p-8 text-center border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-lg font-bold text-foreground mb-1">Заявка отправлена!</p>
                <p className="text-sm text-muted-foreground">Артур свяжется с вами в ближайшее время</p>
              </motion.div>
            ) : !formOpen ? (
              <>
                <CalendarCheck className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Бесплатная консультация</h2>
                <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">Запишитесь на бесплатную консультацию, чтобы обсудить задачи вашего бизнеса и определить точки роста</p>
                <button
                  onClick={() => setFormOpen(true)}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-primary-foreground gradient-primary shadow-glow-sm hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4" />
                  Записаться на бесплатную консультацию
                </button>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center justify-center gap-2"><CalendarCheck className="w-5 h-5 text-blue-400" />Запись на консультацию</h2>
                <form onSubmit={handleFormSubmit} className="max-w-md mx-auto space-y-3 text-left">
                  <input type="text" required placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                  <input type="email" placeholder="Email (необязательно)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Удобный канал связи (необязательно)</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setForm({ ...form, messenger: form.messenger === 'telegram' ? '' : 'telegram', messengerContact: '' })} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${form.messenger === 'telegram' ? 'border-[#29B6F6] bg-[#29B6F6]/10 text-[#29B6F6]' : 'border-border bg-background/40 text-muted-foreground hover:border-[#29B6F6]/50'}`}>
                        <Send className="w-4 h-4" />Telegram
                      </button>
                      <button type="button" onClick={() => setForm({ ...form, messenger: form.messenger === 'max' ? '' : 'max', messengerContact: '' })} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${form.messenger === 'max' ? 'border-[#FF6F00] bg-[#FF6F00]/10 text-[#FF6F00]' : 'border-border bg-background/40 text-muted-foreground hover:border-[#FF6F00]/50'}`}>
                        <MessageCircle className="w-4 h-4" />MAX
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {form.messenger && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <input type="text" placeholder={form.messenger === 'telegram' ? '@username или номер телефона' : 'Ссылка на профиль MAX'} value={form.messengerContact} onChange={(e) => setForm({ ...form, messengerContact: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <textarea placeholder="Кратко опишите задачу (необязательно)" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none" />
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">Отмена</button>
                    <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-foreground gradient-primary shadow-glow-sm hover:scale-105 transition-transform">Отправить</button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* About */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Heart className="w-5 h-5 text-blue-400" />Обо мне</h2>
          <div className="glass-card rounded-xl p-6 space-y-3 text-foreground/80 leading-relaxed">
            <p>Основатель компании ГОЛУБЕВ КОНСАЛТИНГ. Более 12 лет помогаю бизнесу расти системно — выстраиваю отделы продаж, оптимизирую процессы, внедряю инструменты управления и автоматизации.</p>
            <p>Мой подход — не просто консультировать, а внедрять решения и доводить до измеримого результата. Вижу бизнес целиком, нахожу узкие места и строю процессы, которые масштабируются.</p>
            <p>Работаю с малым и средним бизнесом в России и СНГ. За плечами 150+ проектов и 87 клиентов из самых разных отраслей — от IT и e-commerce до производства и услуг.</p>
          </div>
        </motion.section>

        {/* Expertise */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Brain className="w-5 h-5 text-blue-400" />Направления экспертизы</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {expertise.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card rounded-xl p-4 flex items-start gap-3">
                <Icon className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Sales training topics */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-400" />Обучение продажам</h2>
          <div className="glass-card rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-4">Провожу тренинги и обучающие программы для менеджеров и руководителей отделов продаж. Программы строятся на реальных кейсах компании — разбираем записи звонков, проводим ролевые игры, формируем персональные планы развития.</p>
            <ul className="space-y-2">
              {salesTopics.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Consulting topics */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-blue-400" />Консалтинг</h2>
          <div className="glass-card rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-4">Системный подход к развитию бизнеса: от диагностики до внедрения и сопровождения. Результат — предсказуемый рост и процессы, которые работают без постоянного контроля.</p>
            <ul className="space-y-2">
              {consultingTopics.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Education */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-400" />Образование</h2>
          <div className="space-y-3">
            {education.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-xl p-4 flex items-start gap-4"
              >
                {e.year && <span className="text-sm font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-lg shrink-0">{e.year}</span>}
                <div>
                  <p className="text-sm font-bold text-foreground">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Format */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-400" />Формат работы</h2>
          <div className="glass-card rounded-xl p-6 space-y-3 text-foreground/80 text-sm leading-relaxed">
            <p>Консалтинг и обучение — <strong className="text-foreground">очно и онлайн</strong>.</p>
            <p>Работаю с бизнесом по всей <strong className="text-foreground">России и СНГ</strong>.</p>
            <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />г. Москва, метро Красные ворота, Мясницкая ул., 46 стр. 1</p>
          </div>
        </motion.section>

      </main>
      <Footer />
    </div>
  </>
  );
};

export default Golubev;
