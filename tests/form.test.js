const puppeteer = require('puppeteer');

const URL = 'https://web-scriptor.ru/g/puppetform';
const headless = process.env.HEADLESS === '1';
const slowMo = Number(process.env.SLOWMO ?? 150);

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless,
    slowMo,
    defaultViewport: null,
    args: ['--window-size=1280,900'],
  });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

test('форма заполняется и отправляется, появляется окно благодарности', async () => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-test=contact-form]');

  await page.type('input[name=name]', 'Иван', { delay: 50 });
  await page.type('input[name=email]', 'ivan.test@example.com', { delay: 50 });
  await page.type('input[name=tel]', '+79991234567', { delay: 50 });
  await page.type('textarea[name=message]', 'Хочу освоить Puppeteer', { delay: 50 });
  await page.click('[data-test=contact-form] input[type=checkbox]');
  await page.click('button[type=submit]');

  await page.waitForSelector('[data-test=modal]', { visible: true });
  const title = await page.$eval('[data-test=modal] .title', (el) => el.textContent.trim());
  expect(title).toBe('Спасибо большое за ваш вклад!');

  if (!headless) await new Promise((r) => setTimeout(r, 2000));
});
