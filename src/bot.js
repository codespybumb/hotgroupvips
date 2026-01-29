import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN, GROUP_ID, VIP_PRICE, VIP_DAYS } from "./config.js";
import { criarPagamento } from "./mp.js";

console.log("🤖 BOT.JS CARREGADO");

const bot = new TelegramBot(CONFIG.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true
  }
});

// garante que não vai conflitar com webhook antigo
await bot.deleteWebHook();

console.log("🤖 BOT INICIALIZADO, POLLING ATIVO");

// =========================
// /start
// =========================

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `🔥 BEM-VINDO AO VIP 🔥

Acesso por ${CONFIG.DIAS_VIP} dias
Valor: R$ ${CONFIG.VALOR_VIP}

Digite /vip para assinar.`
  );
});

// =========================
// /vip
// =========================

bot.onText(/\/vip/, async (msg) => {
  try {
    const telegramId = msg.from.id.toString();

    console.log("👤 Criando pagamento para:", telegramId);

    const pagamento = await criarPagamento(telegramId);

    await bot.sendMessage(
      msg.chat.id,
      `💳 Pague aqui:\n${pagamento.init_point}`
    );

  } catch (err) {
    console.error("❌ ERRO MP:", err);
    await bot.sendMessage(
      msg.chat.id,
      "❌ Erro ao gerar pagamento, tente novamente."
    );
  }
});

// =========================

export default bot;
