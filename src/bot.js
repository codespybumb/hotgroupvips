// src/bot.js
import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config.js";
import { criarPagamento } from "./mp.js";

console.log("🤖 BOT.JS CARREGADO");

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/vip/, async msg => {
  const telegramId = msg.from.id;

  try {
    const pagamento = await criarPagamento({ telegramId });

    await bot.sendMessage(
      telegramId,
      `💰 PIX GERADO\n\nEscaneie o QR Code para pagar`
    );

    await bot.sendPhoto(
      telegramId,
      Buffer.from(pagamento.qrCodeBase64, "base64")
    );
  } catch (err) {
    console.error(err);
    bot.sendMessage(telegramId, "❌ Erro ao gerar pagamento");
  }
});

export default bot;
