import puppeteer from 'puppeteer';

// Страница с формой, которую тестируем.
const URL = 'https://web-scriptor.ru/g/puppetform';

// HEADLESS=1 — запуск без окна (для CI), по умолчанию браузер виден на экране.
const headless = process.env.HEADLESS === '1';
// slowMo — пауза в мс перед каждым действием Puppeteer, чтобы ход теста было видно глазами.
const slowMo = Number(process.env.SLOWMO ?? 150);

// Тестовые данные для полей формы.
const lead = {
  name: 'Иван',
  email: 'ivan.test@example.com',
  phone: '+79991234567',
  message: 'Хочу освоить Puppeteer',
};

let browser;
let page;

// Один браузер на весь набор тестов: запускаем перед тестами...
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless,
    slowMo,
    defaultViewport: null, // страница занимает всё окно
    args: ['--window-size=1280,900'],
  });
  page = await browser.newPage();
});

// ...и закрываем после них.
afterAll(async () => {
  await browser.close();
});

describe('Contact form', () => {
  test('форма заполняется и отправляется, появляется окно благодарности', async () => {
    // 1. Открытие страницы. Этого шага нет в коде и в списке действий статьи —
    //    это и есть пропущенный пункт из «Упражнения на внимательность».
    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    // 2. Ожидание появления формы обратной связи.
    await page.waitForSelector('[data-test=contact-form]');

    // 3. Заполнение полей. page.type сам ставит фокус в поле;
    //    delay — пауза между символами, чтобы ввод был виден.
    await page.type('input[name=name]', lead.name, { delay: 50 });
    await page.type('input[name=email]', lead.email, { delay: 50 });
    await page.type('input[name=tel]', lead.phone, { delay: 50 });
    await page.type('textarea[name=message]', lead.message, { delay: 50 });

    // 4. Установка флажка «Согласен с условиями».
    await page.click('[data-test=contact-form] input[type=checkbox]');

    // 5. Отправка формы кнопкой «Заказать».
    await page.click('button[type=submit]');

    // 6. Ожидание модального окна и проверка его текста — это и есть вывод о прохождении теста.
    await page.waitForSelector('[data-test=modal]', { visible: true });
    const title = await page.$eval('[data-test=modal] .title', (el) => el.textContent.trim());
    expect(title).toBe('Спасибо большое за ваш вклад!');

    // В оконном режиме держим окно 2 с, чтобы результат попал на видео.
    if (!headless) await new Promise((r) => setTimeout(r, 2000));
  });
});
