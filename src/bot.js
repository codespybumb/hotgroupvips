import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "@prisma/client";
import { CONFIG } from "./config.js";
import { criarPagamento } from "./mp.js";

export const prisma = new PrismaClient();

export const bot = new TelegramBot(CONFIG.BOT_TOKEN, {
  polling: true
});

console.log("🤖 Bot Telegram iniciado");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🔥 BEM-VINDO AO VIP 🔥

Acesso por ${CONFIG.DIAS_VIP} dias
Valor: R$ ${CONFIG.VALOR_VIP}

Digite /vip para assinar.`
  );
});

bot.onText(/\/vip/, async (msg) => {
  const pagamento = await criarPagamento(msg.from.id);

  bot.sendMessage(
    msg.chat.id,
    `💳 Assinatura VIP

👉 Pague aqui:
${pagamento.init_point}`
  );
});
