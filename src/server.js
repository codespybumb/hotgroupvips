import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
import mercadopago from "mercadopago";

const app = express();
app.use(bodyParser.json());

// ================= CONFIG =================
const BOT_TOKEN = process.env.BOT_TOKEN;
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const BASE_URL = process.env.BASE_URL;
const GROUP_ID = process.env.GROUP_ID;
const VALOR_VIP = Number(process.env.VALOR_VIP);
const EMAIL_PADRAO = process.env.EMAIL_PADRAO;

// ================= BOT =================
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
console.log("🤖 BOT CARREGADO");

// ================= MP =================
mercadopago.configure({
  access_token: MP_ACCESS_TOKEN
});

// ================= ASSINATURA =================
async function criarAssinatura(userId) {
  const res = await mercadopago.preapproval.create({
    reason: "VIP Telegram",
    external_reference: String(userId),
    payer_email: EMAIL_PADRAO,

    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: VALOR_VIP,
      currency_id: "BRL"
    },

    back_url: "https://google.com",
    notification_url: `${BASE_URL}/webhook`,
    status: "pending"
  });

  return res.body.init_point;
}

// ================= COMANDO /vip =================
bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const link = await criarAssinatura(chatId);
    await bot.sendMessage(chatId, `💳 Assine aqui:\n${link}`);
  } catch (e) {
    console.error("Erro assinatura:", e.response?.data || e);
    await bot.sendMessage(chatId, "❌ Erro ao gerar assinatura.");
  }
});

// ================= WEBHOOK MP =================
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    if (data.type === "preapproval") {
      const status = data.data.status;
      const userId = data.data.external_reference;

      if (status === "authorized") {
        await bot.sendMessage(
          GROUP_ID,
          `✅ Assinatura ATIVA\nUsuário: ${userId}`
        );
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook erro:", err);
    res.sendStatus(500);
  }
});

// ================= SERVER =================
app.listen(8080, () => {
  console.log("🚀 Server rodando na porta 8080");
});
