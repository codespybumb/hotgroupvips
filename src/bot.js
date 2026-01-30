import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config.js";
import { criarPagamento } from "./mp.js";

console.log("🤖 BOT.JS CARREGADO");

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, msg => {
  bot.sendMessage(
    msg.chat.id,
    "🔥 Bem-vindo ao VIP!\n\nUse /vip para assinar."
  );
});

bot.onText(/\/vip/, async msg => {
  const id = msg.chat.id;

  try {
    const pagamento = await criarPagamento(id);

    await bot.sendMessage(id, "💰 PIX gerado. Escaneie:");
    await bot.sendPhoto(
      id,
      Buffer.from(pagamento.qrBase64, "base64")
    );
  } catch (err) {
    console.error(err);
    bot.sendMessage(id, "❌ Erro ao gerar pagamento.");
  }
});

export default bot;
