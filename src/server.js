import express from "express";
import bot from "./bot.js";
import { GROUP_ID, PORT } from "./config.js";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const data = req.body;

  console.log("🔥 WEBHOOK:", data);

  const telegramId = data.external_reference;
  const status = data.status;

  if (status === "authorized" || status === "active") {
    const invite = await bot.createChatInviteLink(GROUP_ID, {
      member_limit: 1
    });

    await bot.sendMessage(
      telegramId,
      `✅ Assinatura ativa!\n\nEntre no grupo:\n${invite.invite_link}`
    );
  }

  if (status === "cancelled" || status === "paused") {
    await bot.banChatMember(GROUP_ID, telegramId);
    await bot.unbanChatMember(GROUP_ID, telegramId);
  }

  res.sendStatus(200);
});

app.listen(PORT, () =>
  console.log("🚀 Server rodando na porta", PORT)
);
