import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config.js";
import { criarAssinatura } from "./mp.js";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const link = await criarAssinatura({ telegramId: chatId });

    bot.sendMessage(
      chatId,
      `🔥 *ASSINATURA VIP*\n\nAcesse o link para assinar:\n${link}`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Erro ao gerar assinatura.");
  }
});

export default bot;
