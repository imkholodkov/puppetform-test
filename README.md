# puppetform-test

Автотест формы [web-scriptor.ru/g/puppetform](https://web-scriptor.ru/g/puppetform) на Jest + Puppeteer.

Тест открывает браузер в режиме slow mo, заполняет поля «Имя», «Email», «Телефон», «Пожелания»,
ставит галочку «Согласен с условиями», нажимает «Заказать» и проверяет, что появилось окно
«Спасибо большое за ваш вклад!».

```bash
npm install
npm test                 # видимый браузер, slowMo 150 мс
SLOWMO=400 npm test      # медленнее
npm run test:headless    # без окна
```
