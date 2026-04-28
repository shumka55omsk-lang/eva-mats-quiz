Квиз EVA ковриков — версия с диагностикой отправки

Что изменено:
1. Кнопка «Отправить заявку» сохранена в итоговом блоке.
2. Отправка идёт на /api/send-telegram.
3. Токен бота не хранится в index.html.
4. Добавлена диагностика ошибки прямо под кнопкой отправки.
5. /api/send-telegram можно открыть в браузере для проверки:
   - telegramBotTokenConfigured: true
   - telegramChatIdConfigured: true

Обязательно в Vercel:
Project → Settings → Environment Variables:
TELEGRAM_BOT_TOKEN = токен бота
TELEGRAM_CHAT_ID = chat_id

После изменения переменных нужно сделать Redeploy.

Важно:
- Отправка не будет работать при открытии index.html как обычного файла с компьютера.
- Нужно открыть сайт именно через домен Vercel.
