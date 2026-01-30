import express from "express";
import bot from "./bot.js";
import { PORT, GROUP_ID } from "./config.js";
import { MercadoPagoConfig, Payment } from "mercadopago";

console.log("🚀 SERVER.JS CARREGADO");

const app = express();
app.use(express.json());

// =========================
// MERCADO PAGO CLIENT
// =========================

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const payment = new Payment(mpClient);

// =========================
// WEBHOOK MERCADO PAGO
// =========================

app.post("/webhook", async (req, res) => {
  try {
    console.log("🔥 WEBHOOK RECEBIDO:", req.body);

    const paymentId = req.body?.data?.id;
    if (!paymentId) {
      console.log("⚠️ Webhook sem paymentId");
      return res.sendStatus(200);
    }

    const result = await payment.get({ id: paymentId });

    if (result.status !== "approved") {
      console.log("⏳ Pagamento ainda não aprovado");
      return res.sendStatus(200);
    }

    const telegramId = result.metadata?.telegramId;
    if (!telegramId) {
      console.log("⚠️ Sem telegramId no metadata");
      return res.sendStatus(200);
    }

    console.log("✅ Pagamento aprovado | Telegram:", telegramId);

    // =========================
    // LINK ÚNICO DO GRUPO
    // =========================

    const invite = await bot.createChatInviteLink(GROUP_ID, {
      member_limit: 1
    });

    await bot.sendMessage(
      telegramId,
      `🔥 *PAGAMENTO APROVADO!*\n\nEntre no grupo VIP:\n${invite.invite_link}`,
      { parse_mode: "Markdown" }
    );

    console.log("📩 Link enviado para o usuário");

    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ ERRO NO WEBHOOK:", err);
    return res.sendStatus(500);
  }
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
