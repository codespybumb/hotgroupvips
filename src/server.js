import express from "express";
import bot from "./bot.js";
import prisma from "./prisma.js";
import { removeExpiredUsers } from "./jobs/removeExpired.js";
import PORT from "./config.js";

console.log("🚀 SERVER.JS CARREGADO");

const app = express();
app.use(express.json());

// =========================
// Mercado Pago config
// =========================

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
});

// =========================
// WEBHOOK
// =========================

app.post("/webhook", async (req, res) => {
  try {
    console.log("🔥 WEBHOOK RECEBIDO:", req.body);

    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      console.log("⚠️ Sem paymentId");
      return res.sendStatus(200);
    }

    const payment = await mercadopago.payment.findById(paymentId);
    const status = payment.body.status;

    console.log("💰 STATUS:", status);

    if (status !== "approved") {
      return res.sendStatus(200);
    }

    const telegramId = payment.body.metadata?.telegramId;

    if (!telegramId) {
      console.log("⚠️ Sem telegramId no metadata");
      return res.sendStatus(200);
    }

    console.log("👤 Telegram:", telegramId);

    // =========================
    // SALVAR ASSINATURA
    // =========================

    const expira = new Date();
    expira.setDate(expira.getDate() + CONFIG.DIAS_VIP);

    await prisma.assinatura.upsert({
      where: { telegramId: telegramId.toString() },
      update: { expiraEm: expira },
      create: {
        telegramId: telegramId.toString(),
        expiraEm: expira
      }
    });

    console.log("📅 Assinatura salva até:", expira);

    // =========================
    // LINK ÚNICO DO GRUPO
    // =========================

    const invite = await bot.createChatInviteLink(
      CONFIG.GROUP_ID,
      { member_limit: 1 }
    );

    await bot.sendMessage(
      telegramId,
      `✅ Pagamento aprovado!\n\nEntre no grupo VIP:\n${invite.invite_link}`
    );

    console.log("✅ Link enviado");

    res.sendStatus(200);

  } catch (err) {
    console.error("❌ Erro webhook:", err);
    res.sendStatus(500);
  }
});

// =========================
// SERVER
// =========================

const PORT = CONFIG.PORT || 8080;

app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT);

  // remove expirados a cada 1 minuto
  setInterval(removeExpiredUsers, 60 * 1000);
});
