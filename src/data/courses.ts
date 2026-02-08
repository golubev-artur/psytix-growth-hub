import {
  Brain, Heart, Users, Lightbulb, Shield, Target, Eye, Sparkles,
  TrendingUp, Handshake, MessageSquare, BarChart3, Zap, Award, Phone, Megaphone
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CourseBlock {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: "psychology" | "sales";
  badgeText: string;
  benefitIcon: LucideIcon;
  benefitText: string;
  metricsBefore: number;
  metricsAfter: number;
  metricsLabel: string;
  cases: CaseStudy[];
}

export interface CaseStudy {
  name: string;
  role: string;
  result: string;
  quote: string;
}

export const psychologyBlocks: CourseBlock[] = [
  {
    id: "psy-1",
    title: "Когнитивные искажения",
    description: "Научитесь распознавать и использовать 25+ когнитивных искажений для принятия лучших решений и влияния на аудиторию.",
    icon: Brain,
    category: "psychology",
    badgeText: "Топ-1 модуль",
    benefitIcon: Lightbulb,
    benefitText: "Точность решений +40%",
    metricsBefore: 35,
    metricsAfter: 78,
    metricsLabel: "Точность решений (%)",
    cases: [
      { name: "Анна К.", role: "Маркетолог", result: "+62% конверсия", quote: "Я переписала все лендинги, увидев свои слепые зоны." },
      { name: "Дмитрий В.", role: "Предприниматель", result: "×2 прибыль", quote: "Перестал принимать импульсивные решения." },
    ],
  },
  {
    id: "psy-2",
    title: "Эмоциональный интеллект",
    description: "Разберите 5 компонентов EQ: самосознание, саморегуляция, мотивация, эмпатия и социальные навыки.",
    icon: Heart,
    category: "psychology",
    badgeText: "Практический",
    benefitIcon: Users,
    benefitText: "Командная эффективность +55%",
    metricsBefore: 28,
    metricsAfter: 72,
    metricsLabel: "Уровень EQ (баллы)",
    cases: [
      { name: "Елена С.", role: "HR-директор", result: "-40% текучка", quote: "Команда стала работать как единый механизм." },
      { name: "Игорь М.", role: "CEO стартапа", result: "+80% вовлечённость", quote: "Научился слышать команду." },
    ],
  },
  {
    id: "psy-3",
    title: "Психология влияния",
    description: "6 принципов Чалдини, техники НЛП, фреймы убеждения — весь арсенал этичного влияния на людей.",
    icon: Users,
    category: "psychology",
    badgeText: "Продвинутый",
    benefitIcon: Target,
    benefitText: "Убедительность +70%",
    metricsBefore: 30,
    metricsAfter: 85,
    metricsLabel: "Успешность переговоров (%)",
    cases: [
      { name: "Максим Л.", role: "Переговорщик", result: "+90% закрытий", quote: "Каждая встреча стала продуктивной." },
      { name: "Ольга Т.", role: "Руководитель", result: "+45% согласований", quote: "Идеи стали проходить с первого раза." },
    ],
  },
  {
    id: "psy-4",
    title: "Нейробиология привычек",
    description: "Как формируются и меняются привычки на нейронном уровне. Петля привычки, дофаминовые контуры, чек-листы внедрения.",
    icon: Sparkles,
    category: "psychology",
    badgeText: "Научный",
    benefitIcon: Zap,
    benefitText: "Продуктивность +50%",
    metricsBefore: 25,
    metricsAfter: 68,
    metricsLabel: "Выполнение привычек (%)",
    cases: [
      { name: "Павел Н.", role: "Разработчик", result: "+3 ч/день продуктивности", quote: "Автоматизировал свою рутину." },
      { name: "Катерина Р.", role: "Фрилансер", result: "×2 доход", quote: "Привычки — мой секретный инструмент." },
    ],
  },
  {
    id: "psy-5",
    title: "Управление стрессом",
    description: "Модели копинг-стратегий, техники mindfulness, биохакинг стрессоустойчивости для высоких нагрузок.",
    icon: Shield,
    category: "psychology",
    badgeText: "Антикризис",
    benefitIcon: Heart,
    benefitText: "Стрессоустойчивость +60%",
    metricsBefore: 20,
    metricsAfter: 75,
    metricsLabel: "Уровень стрессоустойчивости (%)",
    cases: [
      { name: "Алексей Г.", role: "Топ-менеджер", result: "-70% выгорание", quote: "Научился восстанавливаться за часы, а не недели." },
      { name: "Мария В.", role: "Врач", result: "+45% энергия", quote: "Стресс перестал управлять моей жизнью." },
    ],
  },
  {
    id: "psy-6",
    title: "Поведенческая экономика",
    description: "Теория перспектив Канемана, эффект якоря, фреймирование — инструменты для ценообразования и презентаций.",
    icon: Lightbulb,
    category: "psychology",
    badgeText: "Стратегический",
    benefitIcon: BarChart3,
    benefitText: "Средний чек +35%",
    metricsBefore: 40,
    metricsAfter: 82,
    metricsLabel: "Эффективность ценообразования (%)",
    cases: [
      { name: "Сергей Д.", role: "Продуктолог", result: "+35% ARPU", quote: "Перестроил всю тарифную сетку." },
      { name: "Наталья К.", role: "Владелец бизнеса", result: "+28% маржа", quote: "Клиенты сами выбирают премиум." },
    ],
  },
  {
    id: "psy-7",
    title: "Психология мотивации",
    description: "Теории Маслоу, Герцберга, Self-Determination Theory. Как мотивировать себя, команду и клиентов.",
    icon: Target,
    category: "psychology",
    badgeText: "Лидерский",
    benefitIcon: Award,
    benefitText: "Мотивация команды +65%",
    metricsBefore: 32,
    metricsAfter: 80,
    metricsLabel: "Вовлечённость команды (%)",
    cases: [
      { name: "Андрей П.", role: "Тимлид", result: "+55% скорость", quote: "Команда сама хочет перевыполнять план." },
      { name: "Юлия Ф.", role: "Коуч", result: "×3 клиенты", quote: "Помогаю людям находить свой драйв." },
    ],
  },
  {
    id: "psy-8",
    title: "Нейромаркетинг",
    description: "Eye-tracking паттерны, цветовая психология, триггеры внимания — научный подход к привлечению и удержанию.",
    icon: Eye,
    category: "psychology",
    badgeText: "Инновационный",
    benefitIcon: TrendingUp,
    benefitText: "Вовлечённость аудитории +80%",
    metricsBefore: 22,
    metricsAfter: 74,
    metricsLabel: "CTR контента (%)",
    cases: [
      { name: "Роман Б.", role: "UX-дизайнер", result: "+120% конверсия", quote: "Каждый пиксель теперь работает на результат." },
      { name: "Светлана А.", role: "Email-маркетолог", result: "+85% open rate", quote: "Нейронаука дала мне суперсилу." },
    ],
  },
];

export const salesBlocks: CourseBlock[] = [
  {
    id: "sales-1",
    title: "Система SPIN-продаж",
    description: "Освойте методологию SPIN: ситуационные, проблемные, извлекающие и направляющие вопросы для B2B-продаж.",
    icon: MessageSquare,
    category: "sales",
    badgeText: "Фундамент",
    benefitIcon: TrendingUp,
    benefitText: "Конверсия +45%",
    metricsBefore: 18,
    metricsAfter: 52,
    metricsLabel: "Конверсия в сделку (%)",
    cases: [
      { name: "Виктор Ш.", role: "Account Executive", result: "+180% план", quote: "SPIN изменил мой подход к каждому звонку." },
      { name: "Лариса М.", role: "Sales Manager", result: "×3 сделки", quote: "Клиенты сами приходят к решению." },
    ],
  },
  {
    id: "sales-2",
    title: "Построение воронки",
    description: "От лида до адвоката бренда: настройте каждый этап воронки с метриками, автоматизацией и точками роста.",
    icon: BarChart3,
    category: "sales",
    badgeText: "Системный",
    benefitIcon: Zap,
    benefitText: "Выручка +60%",
    metricsBefore: 25,
    metricsAfter: 70,
    metricsLabel: "Эффективность воронки (%)",
    cases: [
      { name: "Олег К.", role: "CMO", result: "+200% лидов", quote: "Воронка стала предсказуемой машиной." },
      { name: "Ирина Д.", role: "Growth-хакер", result: "-50% CAC", quote: "Каждый этап теперь оптимизирован." },
    ],
  },
  {
    id: "sales-3",
    title: "Работа с возражениями",
    description: "73 шаблона ответов на возражения. Техники «мост», «бумеранг», «изоляция» с практикой на реальных кейсах.",
    icon: Shield,
    category: "sales",
    badgeText: "Практический",
    benefitIcon: Handshake,
    benefitText: "Закрытие сделок +55%",
    metricsBefore: 30,
    metricsAfter: 72,
    metricsLabel: "Преодоление возражений (%)",
    cases: [
      { name: "Тимур Г.", role: "Менеджер продаж", result: "+75% закрытий", quote: "Возражения стали моим преимуществом." },
      { name: "Анастасия Л.", role: "Переговорщик", result: "+40% средний чек", quote: "Каждое «нет» теперь ведёт к «да»." },
    ],
  },
  {
    id: "sales-4",
    title: "Холодные продажи",
    description: "Скрипты холодных звонков и писем, обход секретарей, техники «первых 10 секунд» и follow-up стратегии.",
    icon: Phone,
    category: "sales",
    badgeText: "Интенсив",
    benefitIcon: Target,
    benefitText: "Ответы на cold outreach +80%",
    metricsBefore: 5,
    metricsAfter: 28,
    metricsLabel: "Конверсия холодных касаний (%)",
    cases: [
      { name: "Артём Р.", role: "SDR", result: "×4 встречи", quote: "Cold calling перестал быть пыткой." },
      { name: "Екатерина Н.", role: "BDR", result: "+150% pipeline", quote: "Каждый звонок — это возможность." },
    ],
  },
  {
    id: "sales-5",
    title: "Социальные продажи",
    description: "Продажи через LinkedIn, личный бренд, контент-стратегии, social proof и нетворкинг в digital-среде.",
    icon: Megaphone,
    category: "sales",
    badgeText: "Трендовый",
    benefitIcon: Users,
    benefitText: "Входящие лиды +90%",
    metricsBefore: 12,
    metricsAfter: 55,
    metricsLabel: "Inbound-лиды через соцсети (%)",
    cases: [
      { name: "Денис С.", role: "Консультант", result: "+300% подписчики", quote: "LinkedIn стал моим главным каналом продаж." },
      { name: "Вера Б.", role: "Фрилансер", result: "×5 заявки", quote: "Клиенты приходят сами через мой контент." },
    ],
  },
  {
    id: "sales-6",
    title: "Переговоры и закрытие",
    description: "Техники Гарвардской школы переговоров, BATNA, ZOPA, эмоциональный negotiation — для крупных сделок.",
    icon: Handshake,
    category: "sales",
    badgeText: "Экспертный",
    benefitIcon: Award,
    benefitText: "Win rate +50%",
    metricsBefore: 35,
    metricsAfter: 78,
    metricsLabel: "Win rate переговоров (%)",
    cases: [
      { name: "Николай П.", role: "Enterprise Sales", result: "+65% крупные сделки", quote: "Каждые переговоры — это шахматная партия." },
      { name: "Алина Ж.", role: "Key Account", result: "+40% retention", quote: "Клиенты остаются на годы." },
    ],
  },
  {
    id: "sales-7",
    title: "Продажи через ценность",
    description: "Value-based selling: диагностика болей, расчёт ROI, storytelling ценности, презентация решений.",
    icon: Zap,
    category: "sales",
    badgeText: "Стратегический",
    benefitIcon: BarChart3,
    benefitText: "Средний чек +45%",
    metricsBefore: 40,
    metricsAfter: 85,
    metricsLabel: "Восприятие ценности клиентом (%)",
    cases: [
      { name: "Кирилл Х.", role: "Solution Sales", result: "+100% deal size", quote: "Клиенты сами просят расширенный пакет." },
      { name: "Марина Е.", role: "SaaS Sales", result: "+70% upsell", quote: "Продаю решения, а не продукты." },
    ],
  },
  {
    id: "sales-8",
    title: "Аналитика продаж",
    description: "Дашборды, KPI, прогнозирование, A/B тесты в продажах — data-driven подход для масштабирования.",
    icon: TrendingUp,
    category: "sales",
    badgeText: "Data-driven",
    benefitIcon: Lightbulb,
    benefitText: "Прогнозируемость +70%",
    metricsBefore: 20,
    metricsAfter: 75,
    metricsLabel: "Точность прогнозов (%)",
    cases: [
      { name: "Станислав В.", role: "Head of Sales", result: "+85% forecast accuracy", quote: "Данные заменили интуицию." },
      { name: "Оксана Г.", role: "RevOps", result: "-30% цикл сделки", quote: "Теперь каждое решение подкреплено цифрами." },
    ],
  },
];

export const testimonials = [
  { name: "Александр Т.", role: "Директор по продажам", avatar: "АТ", text: "Psytix полностью изменил мой подход к управлению командой. ROI обучения окупился за 2 недели.", rating: 5 },
  { name: "Мария С.", role: "Психолог-консультант", avatar: "МС", text: "Наконец-то практичная психология! Каждый модуль — это готовый инструмент для работы.", rating: 5 },
  { name: "Евгений К.", role: "Основатель стартапа", avatar: "ЕК", text: "Благодаря блоку нейромаркетинга конверсия нашего лендинга выросла на 340%.", rating: 5 },
  { name: "Ольга Н.", role: "HR Business Partner", avatar: "ОН", text: "Модуль EQ — обязательный для всех лидеров. Текучка в отделе снизилась вдвое.", rating: 5 },
  { name: "Дмитрий Р.", role: "Enterprise AE", avatar: "ДР", text: "SPIN + психология влияния = суперсила в B2B-продажах. Закрыл крупнейшую сделку в карьере.", rating: 5 },
];

export const quizQuestions = [
  {
    id: 1,
    question: "Какая ваша основная цель?",
    options: [
      { text: "Понимать людей и их мотивации", category: "psychology" as const },
      { text: "Увеличить доход и продажи", category: "sales" as const },
      { text: "Развить лидерские качества", category: "both" as const },
      { text: "Построить личный бренд", category: "sales" as const },
    ],
  },
  {
    id: 2,
    question: "Ваш уровень опыта?",
    options: [
      { text: "Начинающий — хочу понять основы", level: "beginner" },
      { text: "Средний — есть опыт, хочу углубить", level: "intermediate" },
      { text: "Продвинутый — нужны экспертные техники", level: "advanced" },
    ],
  },
  {
    id: 3,
    question: "Что для вас важнее всего?",
    options: [
      { text: "Научная база и теория", focus: "theory" },
      { text: "Практические инструменты и шаблоны", focus: "practice" },
      { text: "Кейсы и примеры из реальной жизни", focus: "cases" },
      { text: "Метрики и аналитика результатов", focus: "metrics" },
    ],
  },
];
