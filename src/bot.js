import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "@prisma/client";
import { CONFIG } from "./config.js";
import { criarPagamento } from "./mp.js";

/* ============================
   PRISMA
============================ */
export const prisma = new PrismaClient();

/* ============================
   TELEGRAM BOT
============================ */
export const bot = new TelegramBot(CONFIG.BOT_TOKEN, {
  polling: true,
});

console.log("🤖 Bot iniciando...");

/* ============================
   /start
============================ */
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
`🔥 *BEM-VINDO AO VIP* 🔥

✅ Acesso por *${CONFIG.DIAS_VIP} dias*
💰 Valor: *R$ ${CONFIG.VALOR_VIP}*

👉 Digite /vip para assinar agora.`,
    { parse_mode: "Markdown" }
  );
});

/* ============================
   /vip
============================ */
bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = BigInt(msg.from.id);

  try {
    const pagamento = await criarPagamento(telegramId);

    await bot.sendMessage(
      chatId,
`💳 *Assinatura VIP*

👉 Clique para pagar:
${pagamento.init_point}

⏱ Após o pagamento, o acesso é liberado automaticamente.`,
      { parse_mode: "Markdown" }
    );

  } catch (err) {
    console.error("Erro ao criar pagamento:", err);

    await bot.sendMessage(
      chatId,
      "❌ Erro ao gerar pagamento. Tente novamente em alguns minutos."
    );
  }
});

/* ============================
   KEEP ALIVE / LOG
============================ */
bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

console.log("✅ Bot online e escutando mensagens");
