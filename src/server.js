// src/server.js
import express from "express";
import fetch from "node-fetch";

import bot from "./bot.js";
import { vipUsers } from "./vipStore.js";
import { PORT, MP_ACCESS_TOKEN, GROUP_ID, VIP_DAYS } from "./config.js";
import { removeExpiredUsers } from "./jobs/removeExpired.js";

console.log("🚀 SERVER.JS CARREGADO");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const paymentId = req.body?.data?.id;
    if (!paymentId) return res.sendStatus(200);

    const payment = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`
        }
      }
    ).then(r => r.json());

    if (payment.status !== "approved") {
      return res.sendStatus(200);
    }

    const telegramId = payment.metadata?.telegramId;
    if (!telegramId) return res.sendStatus(200);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + VIP_DAYS);

    vipUsers.set(telegramId, { expiresAt });

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
