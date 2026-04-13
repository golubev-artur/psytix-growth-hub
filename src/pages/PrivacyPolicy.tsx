import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/psytix/Navbar';
import Footer from '@/components/psytix/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Политика обработки персональных данных — Psytix</title>
        <meta name="description" content="Политика обработки персональных данных и использования cookies на платформе Psytix." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://psytix.ru/privacy" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Политика обработки персональных данных</h1>
        <p className="text-sm text-muted-foreground mb-10">Последнее обновление: апрель 2025</p>

        <div className="space-y-8 text-foreground/90 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Общие положения</h2>
            <p>
              Настоящая политика конфиденциальности описывает, как платформа{' '}
              <Link to="/" className="text-primary hover:underline">Psytix</Link> (далее — «Сайт»,
              доступный по адресу <a href="https://psytix.ru" className="text-primary hover:underline">psytix.ru</a>)
              собирает, использует и защищает информацию, которую вы предоставляете при использовании Сайта.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Какие данные мы собираем</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Имя, адрес электронной почты и номер телефона — при заполнении форм заявок на{' '}
                <Link to="/" className="text-primary hover:underline">главной странице</Link> или в{' '}
                <Link to="/blog" className="text-primary hover:underline">блоге</Link>.
              </li>
              <li>Данные об использовании сайта: посещённые страницы, время на сайте, источник перехода — через системы аналитики.</li>
              <li>Технические данные: IP-адрес, тип браузера, операционная система.</li>
              <li>Cookies — файлы, сохраняемые браузером для улучшения работы Сайта.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Использование cookies</h2>
            <p className="mb-3">
              Мы используем следующие типы cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li><strong>Технические cookies</strong> — необходимы для корректной работы Сайта.</li>
              <li><strong>Аналитические cookies</strong> — Google Analytics (GA4) и Яндекс.Метрика для анализа посещаемости и улучшения контента.</li>
              <li><strong>Функциональные cookies</strong> — запоминают ваши предпочтения (например, согласие с данной политикой).</li>
            </ul>
            <p className="mt-3">
              Вы можете отключить cookies в настройках браузера, однако это может повлиять на функциональность Сайта.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Цели обработки данных</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Обработка заявок на обучение, поданных через формы на Сайте.</li>
              <li>Улучшение качества образовательных материалов в{' '}
                <Link to="/blog" className="text-primary hover:underline">блоге</Link> и модулях.
              </li>
              <li>Анализ поведения пользователей для улучшения структуры Сайта.</li>
              <li>Связь с вами по вопросам, указанным в заявке.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Передача данных третьим лицам</h2>
            <p className="mb-3">
              Мы не продаём и не передаём ваши личные данные третьим лицам, за исключением:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li><strong>Google LLC</strong> — аналитика (Google Analytics). Политика конфиденциальности: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/privacy</a>.</li>
              <li><strong>ООО «Яндекс»</strong> — аналитика (Яндекс.Метрика). Политика: <a href="https://yandex.ru/legal/confidential" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">yandex.ru/legal/confidential</a>.</li>
              <li>Случаев, предусмотренных законодательством Российской Федерации.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Хранение данных</h2>
            <p>
              Персональные данные хранятся не дольше, чем это необходимо для достижения целей обработки,
              либо в течение срока, установленного законодательством РФ.
              Данные аналитических систем обезличены и не позволяют идентифицировать конкретного пользователя.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Ваши права</h2>
            <p className="mb-3">В соответствии с Федеральным законом №152-ФЗ «О персональных данных» вы вправе:</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Получить информацию об обработке ваших персональных данных.</li>
              <li>Потребовать уточнения, блокирования или уничтожения данных.</li>
              <li>Отозвать согласие на обработку персональных данных.</li>
              <li>Обжаловать действия оператора в уполномоченном органе по защите прав субъектов персональных данных.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Контакты</h2>
            <p>
              По вопросам, связанным с обработкой персональных данных, вы можете обратиться к нам через форму заявки на{' '}
              <Link to="/" className="text-primary hover:underline">главной странице</Link> или на странице{' '}
              <Link to="/reviews" className="text-primary hover:underline">отзывов</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Изменения политики</h2>
            <p>
              Мы оставляем за собой право вносить изменения в настоящую политику. Актуальная версия
              всегда доступна на этой странице. Продолжение использования Сайта после внесения изменений
              означает ваше согласие с обновлённой политикой.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-border/30">
          <Link to="/" className="text-primary hover:underline text-sm">← Вернуться на главную</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
