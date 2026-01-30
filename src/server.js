import express from "express";
import MercadoPago from "mercadopago";

import bot from "./bot.js";
import prisma from "./prisma.js";
import { removeExpiredUsers } from "./jobs/removeExpired.js";
import {
  PORT,
  MP_ACCESS_TOKEN,
  GROUP_ID,
  VIP_DAYS
} from "./config.js";

console.log("🚀 SERVER.JS CARREGADO");

const app = express();
app.use(express.json());

// 🔥 CLIENTE MP (SDK NOVO)
const mp = new MercadoPago({
  accessToken: MP_ACCESS_TOKEN
});

// =========================
// WEBHOOK
// =========================
app.post("/webhook", async (req, res) => {
  try {
    const paymentId = req.body?.data?.id;
    if (!paymentId) return res.sendStatus(200);

    const payment = await mp.payment.get(paymentId);
    if (payment.status !== "approved") return res.sendStatus(200);

    const telegramId = payment.metadata?.telegramId;
    if (!telegramId) return res.sendStatus(200);

    const expira = new Date();
    expira.setDate(expira.getDate() + VIP_DAYS);

    await prisma.assinatura.upsert({
      where: { telegramId: telegramId.toString() },
      update: { expiraEm: expira },
      create: { telegramId: telegramId.toString(), expiraEm: expira }
    });

    const invite = await bot.createChatInviteLink(GROUP_ID, {
      member_limit: 1
    });

    await bot.sendMessage(
      telegramId,
      `✅ Pagamento aprovado!\n\nEntre no grupo VIP:\n${invite.invite_link}`
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook erro:", err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT);
  setInterval(removeExpiredUsers, 60 * 1000);
});
