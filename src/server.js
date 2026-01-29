import express from "express";
import mercadopago from "mercadopago";
import bot from "./bot.js";

console.log("🚀 SERVER.JS CARREGADO");

const app = express();
app.use(express.json());

// =========================
// Mercado Pago config
// =========================

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// =========================
// WEBHOOK
// =========================

app.post("/webhook", async (req, res) => {
  try {
    console.log("🔥 WEBHOOK RECEBIDO:", req.body);

    const paymentId = req.body?.data?.id;
    if (!paymentId) {
      return res.sendStatus(200);
    }

    const payment = await mercadopago.payment.findById(paymentId);

    console.log("💰 STATUS:", payment.body.status);

    if (payment.body.status === "approved") {
      const telegramId = payment.body.metadata.telegramId;

      console.log("👤 Telegram:", telegramId);

      const invite = await bot.createChatInviteLink(
        process.env.GROUP_ID,
        { member_limit: 1 }
      );

      await bot.sendMessage(
        telegramId,
        ✅ Pagamento aprovado!\n\nEntre no grupo VIP:\n${invite.invite_link}
      );

      console.log("✅ Link enviado");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Erro webhook:", err);
    res.sendStatus(500);
  }
});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT);
});