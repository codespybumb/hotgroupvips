import express from "express";
import { bot, prisma } from "./bot.js";
import { CONFIG } from "./config.js";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    // Só processa pagamento aprovado
    if (data.type !== "payment" || data.data?.status !== "approved") {
      return res.sendStatus(200);
    }

    const telegramId = data.data.metadata?.telegramId;

    if (!telegramId) {
      console.log("⚠️ Telegram ID não encontrado no metadata");
      return res.sendStatus(200);
    }

    const expiresAt = new Date(
      Date.now() + CONFIG.DIAS_VIP * 24 * 60 * 60 * 1000
    );

    await prisma.vipUser.upsert({
      where: { telegramId: BigInt(telegramId) },
      update: {
        expiresAt,
        isActive: true
      },
      create: {
        telegramId: BigInt(telegramId),
        expiresAt,
        isActive: true
      }
    });

    await bot.sendMessage(
      CONFIG.GROUP_ID,
      "✅ Novo VIP ativado automaticamente!"
    );

    console.log("🎉 VIP ativado:", telegramId);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Erro no webhook:", err);
    res.sendStatus(500);
  }
});

const PORT = CONFIG.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
