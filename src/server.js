import express from "express";
import mercadopago from "mercadopago";

import bot from "./bot.js";
import { vipUsers } from "./vipStore.js";
import {
  PORT,
  GROUP_ID,
  VIP_DAYS,
  MP_ACCESS_TOKEN
} from "./config.js";
import { removeExpiredUsers } from "./jobs/removeExpired.js";

console.log("🚀 SERVER.JS CARREGADO");

mercadopago.configure({
  access_token: MP_ACCESS_TOKEN
});

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const paymentId = req.body?.data?.id;
    if (!paymentId) return res.sendStatus(200);

    const payment =
      await mercadopago.payment.findById(paymentId);

    if (payment.body.status !== "approved") {
      return res.sendStatus(200);
    }

    const telegramId =
      payment.body.metadata?.telegramId;

    if (!telegramId) return res.sendStatus(200);

    const expires = new Date();
    expires.setDate(expires.getDate() + VIP_DAYS);
    vipUsers.set(telegramId, { expires });

    const invite =
      await bot.createChatInviteLink(GROUP_ID, {
        member_limit: 1
      });

    await bot.sendMessage(
      telegramId,
      `✅ Pagamento aprovado!\n\nEntre no VIP:\n${invite.invite_link}`
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook erro:", err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT);
  setInterval(removeExpiredUsers, 60 * 1000);
});
