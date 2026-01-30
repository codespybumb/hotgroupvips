import TelegramBot from "node-telegram-bot-api";
import { criarAssinatura } from "./mp.js";
import { config } from "./config.js";

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const link = await criarAssinatura(chatId);
    await bot.sendMessage(chatId, `💳 Assine aqui:\n${link}`);
  } catch {
    await bot.sendMessage(chatId, "❌ Erro ao gerar assinatura.");
  }
});

console.log("🤖 BOT.JS CARREGADO");
