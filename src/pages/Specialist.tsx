import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, Heart, Brain, Baby, Users, MapPin, Clock, CheckCircle2, BookOpen, Star, X, ChevronLeft, ChevronRight, FileCheck, CalendarCheck, Send, MessageCircle, ShoppingCart, BookMarked, Trophy } from 'lucide-react';
import Navbar from '@/components/psytix/Navbar';
import Footer from '@/components/psytix/Footer';
import { toast } from 'sonner';
import { sendLeadToTelegram } from '@/lib/telegram';
import { hasContact, NO_CONTACT_MESSAGE } from '@/lib/leadContact';

const education = [
  { year: '2024', title: 'Московский институт психоанализа', desc: 'Магистратура по профилю «Клиническая психология»', diplomas: [] as string[] },
  { year: '2026', title: 'Первый МГМУ им. И.М. Сеченова', desc: 'Переквалификация по медицинской психологии', diplomas: [] as string[] },
  { year: '2024', title: 'Ассоциация когнитивно-поведенческой психотерапии', desc: 'Когнитивно-поведенческий психотерапевт', diplomas: [
    '/diplomas/kpt-2024.jpg',
    '/diplomas/kpt-basics.jpg',
    '/diplomas/kpt-intro-therapy.jpg',
    '/diplomas/kpt-conceptualization.jpg',
    '/diplomas/kpt-cognitive-therapy.jpg',
    '/diplomas/kpt-rebt.jpg',
    '/diplomas/kpt-anxiety.jpg',
  ] },
  { year: '2024', title: 'Театральный факультет (Школа нового театра)', desc: 'Профессиональная переподготовка — «Актерское мастерство»', diplomas: [] as string[] },
  { year: '2022', title: 'Московский институт гипноза', desc: 'Сертифицированный гипнотерапевт', diplomas: ['/diplomas/hypnosis-2022.jpg'] },
  { year: '2022', title: 'Московский институт психоанализа', desc: 'Сертификат «Невротические расстройства: причины, диагностика, принципы терапии»', diplomas: ['/diplomas/mip-neurotic-2022.jpg'] },
  { year: '2015', title: 'ЛГТУ', desc: 'Бакалавриат по профилю «Общая психология»', diplomas: ['/diplomas/lgtu-2015.jpg'] },
  { year: '2014', title: 'РАНХиГС при Президенте РФ', desc: 'Специалитет по профилю «Финансы и кредит»', diplomas: ['/diplomas/ranepa-2014.jpg'] },
];

const methods = ['КПТ', 'АСТ', 'НЛП', 'Гипнотерапия', 'Гештальт-терапия', 'Эмоционально-образная терапия'];

const adultTopics = [
  'Работа с самооценкой, уверенность в себе',
  'Избавление или снижение симптомов личностных и аффективных расстройств',
  'Избавление от панических атак, фобий',
  'Снижение боли при потере близкого человека',
  'Самореализация, карьерный рост, выгорание',
  'Построение гармоничных отношений с близкими и коллегами',
  'Избавление от одиночества, стыда, обиды, гнева, вины',
  'Физиологические симптомы, психосоматика',
  'Экзистенциальные вопросы — потеря смысла жизни, кризис возраста',
  'Патопсихологическая, нейропсихологическая диагностика',
];

const childTopics = [
  'Работа с самооценкой, уверенность в себе, отношения со сверстниками',
  'Эмоциональные переживания, умение контролировать эмоции',
  'Отношения в семье, ревность к братьям и сестрам',
  'Развод родителей',
  'Трудности с адаптацией в школе или детском саду',
  'Школьная тревожность, страх экзаменов',
  'Психологические проблемы с дефекацией и мочеиспусканием',
  'Патопсихологическая, нейропсихологическая диагностика',
];

const familyTopics = [
  'Конфликты и коммуникативные трудности между супругами',
  'Конфликты между супругами и детьми',
  'Кризисные ситуации и перемены',
  'Проблемы в супружеских отношениях',
  'Трудности в детско-родительских отношениях',
  'Эмоциональные и психологические проблемы',
];

const sportTopics = [
  'Снижение предстартовой тревожности и управление стрессом',
  'Проработка страхов поражения и соперника, укрепление уверенности и здоровой самооценки в спорте и жизни',
  'Развитие концентрации, саморегуляции и визуализации',
  'Постановка целей, поддержание мотивации и профилактика выгорания',
  'Интеграция психологических техник в тренировочный процесс',
];

const DiplomaModal = ({ images, onClose }: { images: string[]; onClose: () => void }) => {
  const [idx, setIdx] = useState(0);
  const multi = images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-2 -right-2 z-10 w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="w-full overflow-hidden rounded-xl bg-background/20 border border-border/30">
          <img src={images[idx]} alt="Диплом" className="w-full h-auto max-h-[80vh] object-contain" />
        </div>

        {multi && (
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              className="w-10 h-10 rounded-full bg-background/60 border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground">{idx + 1} / {images.length}</span>
            <button
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              className="w-10 h-10 rounded-full bg-background/60 border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const bookPages = [
  '/book-pages/page-0.jpg',
  '/book-pages/page-1.jpg',
  '/book-pages/page-2.jpg',
  '/book-pages/page-3.jpg',
  '/book-pages/page-4.jpg',
  '/book-pages/page-5.jpg',
];

const BookViewer = ({ onClose, onBuy }: { onClose: () => void; onBuy: () => void }) => {
  const [page, setPage] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-2 -right-2 z-10 w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="w-full overflow-hidden rounded-xl bg-white shadow-2xl">
          <img src={bookPages[page]} alt={page === 0 ? 'Обложка книги' : `Страница ${page}`} className="w-full h-auto max-h-[70vh] object-contain" />
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-10 h-10 rounded-full bg-background/60 border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-muted-foreground">{page === 0 ? 'Обложка' : `${page} / ${bookPages.length - 1}`}</span>
          <button
            onClick={() => setPage((p) => Math.min(bookPages.length - 1, p + 1))}
            disabled={page === bookPages.length - 1}
            className="w-10 h-10 rounded-full bg-background/60 border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => { onClose(); onBuy(); }}
          className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-primary-foreground gradient-primary shadow-glow-sm hover:scale-105 transition-transform"
        >
          <ShoppingCart className="w-4 h-4" />
          Купить книгу
        </button>
      </motion.div>
    </motion.div>
  );
};

const Specialist = () => {
  const [diplomaImages, setDiplomaImages] = useState<string[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', messenger: '' as '' | 'telegram' | 'max', messengerContact: '', comment: '' });
  const [bookViewerOpen, setBookViewerOpen] = useState(false);
  const [bookBuyOpen, setBookBuyOpen] = useState(false);
  const [bookBuySubmitted, setBookBuySubmitted] = useState(false);
  const [bookForm, setBookForm] = useState({ name: '', phone: '', email: '', messenger: '' as '' | 'telegram' | 'max', messengerContact: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasContact(form.email, form.messengerContact)) {
      toast.error(NO_CONTACT_MESSAGE);
      return;
    }
    sendLeadToTelegram({
      name: form.name.trim(),
      email: form.email.trim(),
      comment: form.comment.trim() || undefined,
      messenger: form.messenger === 'telegram' ? 'Telegram' : form.messenger === 'max' ? 'MAX' : undefined,
      messengerContact: form.messengerContact.trim() || undefined,
      page: window.location.href,
      button: 'Записаться на бесплатную консультацию — Специалист',
    });
    setSubmitted(true);
    setFormOpen(false);
  };

  const handleBookBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasContact(bookForm.email, bookForm.phone, bookForm.messengerContact)) {
      toast.error(NO_CONTACT_MESSAGE);
      return;
    }
    sendLeadToTelegram({
      name: bookForm.name.trim(),
      email: bookForm.email.trim(),
      phone: bookForm.phone.trim() || undefined,
      messenger: bookForm.messenger === 'telegram' ? 'Telegram' : bookForm.messenger === 'max' ? 'MAX' : undefined,
      messengerContact: bookForm.messengerContact.trim() || undefined,
      page: window.location.href,
      button: 'Купить книгу — «Не убивайте любовь»',
    });
    setBookBuySubmitted(true);
  };

  return (
  <>
    <Helmet>
      <title>Мария Лозовая — Клинический психолог в Москве | Психотерапия КПТ</title>
      <meta name="description" content="Мария Лозовая — клинический психолог, член Ассоциации когнитивно-поведенческой психотерапии. Более 2 500 часов практики. Психотерапия со взрослыми, детьми и семьями. КПТ, гипнотерапия, гештальт. Приём в Москве и онлайн. Запись на бесплатную консультацию." />
      <meta name="keywords" content="Мария Лозовая, Мария Лозовая психолог, Лозовая Мария Александровна, клинический психолог Москва, психотерапевт Москва, КПТ психолог, когнитивно-поведенческая терапия, психолог онлайн, детский психолог Москва, семейный психолог, гипнотерапевт, панические атаки психолог, психолог самооценка, mariyalozovaya" />
      <link rel="canonical" href="https://psytix.ru/mariyalozovaya" />
      <meta property="og:type" content="profile" />
      <meta property="og:title" content="Мария Лозовая — Клинический психолог в Москве" />
      <meta property="og:description" content="Клинический психолог Мария Лозовая. Более 2 500 часов практики. КПТ, гипнотерапия, гештальт. Психотерапия со взрослыми, детьми и семьями. Приём в Москве и онлайн." />
      <meta property="og:url" content="https://psytix.ru/mariyalozovaya" />
      <meta property="og:image" content="https://psytix.ru/specialist-photo.jpg" />
      <meta property="og:site_name" content="Psytix" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="profile:first_name" content="Мария" />
      <meta property="profile:last_name" content="Лозовая" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Мария Лозовая — Клинический психолог в Москве" />
      <meta name="twitter:description" content="Клинический психолог, член Ассоциации КПТ. Более 2 500 часов практики. Запись на бесплатную консультацию." />
      <meta name="twitter:image" content="https://psytix.ru/specialist-photo.jpg" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Мария Лозовая",
        "givenName": "Мария",
        "familyName": "Лозовая",
        "additionalName": "Александровна",
        "jobTitle": "Клинический психолог",
        "description": "Клинический психолог, член Ассоциации когнитивно-поведенческой психотерапии. Более 2 500 часов практики. Психотерапия со взрослыми, детьми и семьями.",
        "url": "https://psytix.ru/mariyalozovaya",
        "image": "https://psytix.ru/specialist-photo.jpg",
        "sameAs": ["https://mariyalozovaya.ru"],
        "alumniOf": [
          { "@type": "CollegeOrUniversity", "name": "Московский институт психоанализа" },
          { "@type": "CollegeOrUniversity", "name": "Первый МГМУ им. И.М. Сеченова" },
          { "@type": "CollegeOrUniversity", "name": "РАНХиГС при Президенте РФ" },
          { "@type": "CollegeOrUniversity", "name": "ЛГТУ" }
        ],
        "memberOf": { "@type": "Organization", "name": "Ассоциация когнитивно-поведенческой психотерапии" },
        "knowsAbout": ["КПТ", "Когнитивно-поведенческая терапия", "Гипнотерапия", "Гештальт-терапия", "Детская психология", "Семейная психотерапия", "Панические атаки", "Фобии", "Самооценка"],
        "workLocation": {
          "@type": "Place",
          "name": "Кабинет психолога",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Мясницкая ул., 46 стр. 1, кабинет 27",
            "addressLocality": "Москва",
            "addressCountry": "RU"
          }
        }
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Психолог Мария Лозовая",
        "description": "Психологическая помощь взрослым, детям и семьям. КПТ, гипнотерапия, гештальт-терапия.",
        "url": "https://psytix.ru/mariyalozovaya",
        "image": "https://psytix.ru/specialist-photo.jpg",
        "telephone": "",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Мясницкая ул., 46 стр. 1, кабинет 27",
          "addressLocality": "Москва",
          "addressCountry": "RU"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 55.7650,
          "longitude": 37.6380
        },
        "areaServed": [
          { "@type": "City", "name": "Москва" },
          { "@type": "Country", "name": "Россия" }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Услуги психолога",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Психотерапия со взрослыми", "description": "КПТ, гипнотерапия, гештальт. 50–60 мин." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Психотерапия с детьми и подростками", "description": "Сказкотерапия, техники Станиславского. 50–60 мин." } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Семейная психотерапия", "description": "Интегрированный подход. 90 мин." } }
          ]
        }
      })}</script>
    </Helmet>
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">

        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-16">
          <div className="shrink-0">
            <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-primary/30 overflow-hidden flex items-center justify-center">
              <img src="/specialist-photo.jpg" alt="Мария Лозовая" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'; }} />
            </div>
          </div>
          <div>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-1">Клинический психолог</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Мария Лозовая</h1>
            <p className="text-muted-foreground text-sm mb-4">Член Ассоциации когнитивно-поведенческой психотерапии</p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Моя миссия — помочь вам почувствовать себя счастливыми, избавиться от ограничивающих убеждений, панических атак и другой неприятной психологической симптоматики, обрести здоровые отношения с собой и с окружающими.
            </p>
            <div className="flex flex-wrap gap-2">
              {methods.map((m) => (
                <span key={m} className="text-xs px-3 py-1 rounded-full bg-purple-600/20 text-purple-200 border border-purple-500/30 font-medium">{m}</span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Clock, label: 'Практика с', value: '2015 г.' },
            { icon: Star, label: 'Часов практики', value: '2 500+' },
            { icon: BookOpen, label: 'Подходов терапии', value: '6' },
            { icon: Award, label: 'Дипломов', value: '8' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-card rounded-xl p-4 text-center">
              <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.section>

        {/* CTA — Consultation */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <div className="glass-card rounded-2xl p-6 md:p-8 text-center border-primary/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-lg font-bold text-foreground mb-1">Заявка отправлена!</p>
                <p className="text-sm text-muted-foreground">Мария свяжется с вами в ближайшее время</p>
              </motion.div>
            ) : !formOpen ? (
              <>
                <CalendarCheck className="w-10 h-10 text-primary mx-auto mb-3" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Бесплатная консультация</h2>
                <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">Запишитесь на бесплатную 15-минутную консультацию, чтобы обсудить ваш запрос и подобрать подходящий формат работы</p>
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
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center justify-center gap-2"><CalendarCheck className="w-5 h-5 text-primary" />Запись на консультацию</h2>
                <form onSubmit={handleFormSubmit} className="max-w-md mx-auto space-y-3 text-left">
                  <input
                    type="text"
                    required
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />

                  {/* Messenger choice */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Удобный канал связи — email или мессенджер</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, messenger: form.messenger === 'telegram' ? '' : 'telegram', messengerContact: '' })}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${form.messenger === 'telegram' ? 'border-[#29B6F6] bg-[#29B6F6]/10 text-[#29B6F6]' : 'border-border bg-background/40 text-muted-foreground hover:border-[#29B6F6]/50'}`}
                      >
                        <Send className="w-4 h-4" />
                        Telegram
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, messenger: form.messenger === 'max' ? '' : 'max', messengerContact: '' })}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${form.messenger === 'max' ? 'border-[#FF6F00] bg-[#FF6F00]/10 text-[#FF6F00]' : 'border-border bg-background/40 text-muted-foreground hover:border-[#FF6F00]/50'}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        MAX
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {form.messenger && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <input
                          type="text"
                          placeholder={form.messenger === 'telegram' ? '@username или номер телефона' : 'Ссылка на профиль MAX'}
                          value={form.messengerContact}
                          onChange={(e) => setForm({ ...form, messengerContact: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <textarea
                    placeholder="Кратко опишите ваш запрос (необязательно)"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                  />

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-foreground gradient-primary shadow-glow-sm hover:scale-105 transition-transform"
                    >
                      Отправить
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* About */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><Heart className="w-5 h-5 text-primary" />Обо мне</h2>
          <div className="glass-card rounded-xl p-6 space-y-3 text-foreground/80 leading-relaxed">
            <p>Клинический психолог с многолетним опытом работы. Специализируюсь на оказании психологической помощи, чтобы вы могли жить полноценной и счастливой жизнью.</p>
            <p>Разрабатываю индивидуальный подход в зависимости от личности клиента. Учитываю ваши уникальные потребности и цели, предлагая персонализированные планы терапии.</p>
            <p>Гарантирую полную конфиденциальность наших встреч и предоставляю постоянную поддержку в процессе терапии.</p>
            <p>Являюсь практикующим взрослым и детским психологом, автором книги, научных публикаций и терапевтических сказок по психологии с 2015 года. Прохожу личную терапию и супервизию, провожу пато- и нейродиагностику.</p>
          </div>
        </motion.section>

        {/* Book */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><BookMarked className="w-5 h-5 text-primary" />Книга автора</h2>
          <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div
              className="shrink-0 cursor-pointer group"
              onClick={() => setBookViewerOpen(true)}
            >
              <div className="w-40 rounded-xl overflow-hidden shadow-lg border border-border/30 group-hover:shadow-primary/20 group-hover:border-primary/40 transition-all group-hover:scale-105">
                <img src="/book-pages/page-0.jpg" alt="Обложка книги «Не убивайте любовь»" className="w-full h-auto" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <button
                onClick={() => setBookViewerOpen(true)}
                className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                «Не убивайте любовь»
              </button>
              <p className="text-sm text-muted-foreground mt-1 mb-3">Мария Лозовая</p>
              <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                Книга о любви, которая проживается сердцем. Две повести и стихи — о первой любви, о потерях, о том, что в каждом из нас живёт ребёнок, который верит в чудеса. Нажмите на обложку, чтобы прочитать первые страницы.
              </p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <button
                  onClick={() => setBookViewerOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Читать отрывок
                </button>
                <button
                  onClick={() => setBookBuyOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-primary-foreground gradient-primary shadow-glow-sm hover:scale-105 transition-transform"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Купить
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Services */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 space-y-8">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Brain className="w-5 h-5 text-primary" />Направления работы</h2>

          {/* Adults */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-foreground">Психотерапия со взрослыми</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Длительность 50–60 мин. Интегрированный подход — работа одновременно с сознанием и подсознанием. Результат в среднем за 2–10 сессий.</p>
            <ul className="space-y-2">
              {adultTopics.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>

          {/* Children */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Baby className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-foreground">Психотерапия с детьми и подростками</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Длительность 50–60 мин. Быстрый контакт с детьми, результат заметен после первой сессии. До 7 лет — сказкотерапия и техники Станиславского. Старше 7 — техники взрослой психотерапии, адаптированные под возраст.</p>
            <ul className="space-y-2">
              {childTopics.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>

          {/* Family */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-bold text-foreground">Семейная психотерапия</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Длительность 90 мин. Семейный интегрированный подход. Наладьте отношения и станьте важным поддерживающим и счастливым союзом друг для друга.</p>
            <ul className="space-y-2">
              {familyTopics.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>

          {/* Sport Psychology */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Психотерапия по спортивной психологии</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Работа с психологическими аспектами спортивной деятельности. Помощь спортсменам в достижении максимальной результативности через ментальную подготовку.</p>
            <ul className="space-y-2">
              {sportTopics.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />{t}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Education */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" />Образование и квалификация</h2>
          <div className="space-y-3">
            {education.map((e, i) => {
              const hasDiploma = e.diplomas.length > 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`glass-card rounded-xl p-4 flex items-start gap-4 ${hasDiploma ? 'cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors' : ''}`}
                  onClick={hasDiploma ? () => setDiplomaImages(e.diplomas) : undefined}
                >
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg shrink-0">{e.year}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.desc}</p>
                  </div>
                  {hasDiploma && (
                    <FileCheck className="w-5 h-5 text-primary/60 shrink-0 mt-1" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Location */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />Приём</h2>
          <div className="glass-card rounded-xl p-6 space-y-3 text-foreground/80 text-sm leading-relaxed">
            <p>Со взрослыми и подростками возможен приём <strong className="text-foreground">очно и онлайн</strong>.</p>
            <p>С детьми до 7 лет — <strong className="text-foreground">только очный приём</strong>.</p>
            <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />г. Москва, метро Красные ворота, Мясницкая ул., 46 стр. 1, кабинет психолога № 27</p>
          </div>
        </motion.section>

      </main>
      <Footer />

      <AnimatePresence>
        {diplomaImages && (
          <DiplomaModal images={diplomaImages} onClose={() => setDiplomaImages(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookViewerOpen && (
          <BookViewer onClose={() => setBookViewerOpen(false)} onBuy={() => setBookBuyOpen(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookBuyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setBookBuyOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-md w-full glass-card rounded-2xl p-6 md:p-8 border border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setBookBuyOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/60 border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors">
                <X className="w-4 h-4" />
              </button>

              {bookBuySubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-lg font-bold text-foreground mb-1">Заявка отправлена!</p>
                  <p className="text-sm text-muted-foreground">Мы свяжемся с вами для оформления покупки</p>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-5">
                    <ShoppingCart className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-foreground">Купить книгу</h3>
                    <p className="text-sm text-muted-foreground">«Не убивайте любовь» — Мария Лозовая</p>
                  </div>
                  <form onSubmit={handleBookBuy} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Ваше имя (необязательно)"
                      value={bookForm.name}
                      onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="tel"
                      placeholder="Телефон (необязательно)"
                      value={bookForm.phone}
                      onChange={(e) => setBookForm({ ...bookForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="email"
                      placeholder="Email (необязательно)"
                      value={bookForm.email}
                      onChange={(e) => setBookForm({ ...bookForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    />

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Как с вами связаться — телефон, email или мессенджер</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBookForm({ ...bookForm, messenger: bookForm.messenger === 'telegram' ? '' : 'telegram', messengerContact: '' })}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${bookForm.messenger === 'telegram' ? 'border-[#29B6F6] bg-[#29B6F6]/10 text-[#29B6F6]' : 'border-border bg-background/40 text-muted-foreground hover:border-[#29B6F6]/50'}`}
                        >
                          <Send className="w-4 h-4" />
                          Telegram
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookForm({ ...bookForm, messenger: bookForm.messenger === 'max' ? '' : 'max', messengerContact: '' })}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${bookForm.messenger === 'max' ? 'border-[#FF6F00] bg-[#FF6F00]/10 text-[#FF6F00]' : 'border-border bg-background/40 text-muted-foreground hover:border-[#FF6F00]/50'}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          MAX
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {bookForm.messenger && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <input
                            type="text"
                            placeholder={bookForm.messenger === 'telegram' ? '@username или номер телефона' : 'Ссылка на профиль MAX'}
                            value={bookForm.messengerContact}
                            onChange={(e) => setBookForm({ ...bookForm, messengerContact: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-background/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setBookBuyOpen(false)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-foreground gradient-primary shadow-glow-sm hover:scale-105 transition-transform"
                      >
                        Отправить заявку
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </>
  );
};

export default Specialist;
