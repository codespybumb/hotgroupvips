import './bot.js'   // FORÇA execução
import express from 'express'
import { CONFIG } from './config.js'
import { bot } from './bot.js'
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

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

      // cria link de convite único
      const invite = await bot.createChatInviteLink(
        process.env.GROUP_ID,
        {
          member_limit: 1
        }
      );

      await bot.sendMessage(
        telegramId,
        `✅ Pagamento aprovado!\n\nEntre no grupo VIP:\n${invite.invite_link}`
      );

      console.log("✅ Link enviado pro usuário");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Erro no webhook:", err);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log("🚀 Server rodando");
});