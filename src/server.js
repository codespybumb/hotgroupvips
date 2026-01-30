import express from "express";
import bot from "./bot.js";
import { GROUP_ID, PORT } from "./config.js";

const app = express();
app.use(express.json());

console.log("🚀 SERVER.JS CARREGADO");

app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    console.log("🔔 WEBHOOK MP:", data);

    const telegramId = data.external_reference;
    const status = data.status;

    if (!telegramId) return res.sendStatus(200);

    // PAGAMENTO ATIVO
    if (status === "authorized" || status === "active") {
      const invite = await bot.createChatInviteLink(GROUP_ID, {
        member_limit: 1
      });

      await bot.sendMessage(
        telegramId,
        `✅ Assinatura confirmada!\n\nEntre no grupo VIP:\n${invite.invite_link}`
      );
    }

    // CANCELADO / PAUSADO
    if (status === "cancelled" || status === "paused") {
      await bot.banChatMember(GROUP_ID, telegramId);
      await bot.unbanChatMember(GROUP_ID, telegramId);
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("❌ ERRO WEBHOOK:", e);
    res.sendStatus(500);
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server rodando na porta ${PORT}`)
);
