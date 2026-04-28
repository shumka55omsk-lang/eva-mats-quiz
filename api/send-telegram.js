function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = async function handler(req, res) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Проверка API через браузер
    if (req.method === "GET") {
      return res.status(200).json({
        ok: true,
        api: "send-telegram",
        telegramBotTokenConfigured: Boolean(token),
        telegramChatIdConfigured: Boolean(chatId),
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        ok: false,
        error: "Method not allowed",
      });
    }

    if (!token || !chatId) {
      return res.status(500).json({
        ok: false,
        error: "Не настроены TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID в Vercel",
      });
    }

    const body = req.body || {};

    const text = [
      "<b>Новая заявка на EVA коврики</b>",
      "",
      "<b>Авто:</b> " + escapeHtml(body.brand) + " " + escapeHtml(body.model),
      "<b>Год:</b> " + escapeHtml(body.year),
      "<b>Поколение:</b> " + escapeHtml(body.generation),
      "",
      "<b>Коврики:</b> " + escapeHtml(body.matsType),
      "<b>Багажник:</b> " + escapeHtml(body.trunk),
      "<b>Подпятник:</b> " + escapeHtml(body.heelPad),
      "",
      "<b>Имя:</b> " + escapeHtml(body.name || "Не указано"),
      "<b>Телефон:</b> " + escapeHtml(body.phone || "Не указан"),
      "<b>Куда ответить:</b> " + escapeHtml(body.messenger || "Не указано"),
      "",
      "<b>Комментарий:</b>",
      escapeHtml(body.comment || "Без комментария"),
    ].join("\n");

    const telegramResponse = await fetch(
      "https://api.telegram.org/bot" + token + "/sendMessage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text.slice(0, 4000),
          parse_mode: "HTML",
        }),
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      return res.status(502).json({
        ok: false,
        error: telegramData.description || "Telegram error",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Заявка отправлена",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Server error",
    });
  }
};
