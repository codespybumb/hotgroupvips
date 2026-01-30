import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config.js";
import { criarAssinatura } from "./mp.js";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log("🤖 BOT.JS CARREGADO");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🔥 Bem-vindo!\n\nDigite /vip para assinar o grupo VIP."
  );
});

bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const link = await criarAssinatura(chatId);

    await bot.sendMessage(
      chatId,
      `💳 *Assinatura VIP*\n\nClique para assinar:\n${link}`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Erro ao gerar assinatura.");
  }
});

export default bot;
