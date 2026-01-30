import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
import { config } from "./config.js";

const app = express();
app.use(bodyParser.json());

const bot = new TelegramBot(config.BOT_TOKEN);

app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    if (data.type === "preapproval") {
      const status = data.data.status;
      const userId = data.data.external_reference;

      if (status === "authorized") {
        await bot.sendMessage(
          config.GROUP_ID,
          `✅ Assinatura ativada para usuário ${userId}`
        );
      }
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("Webhook erro:", e);
    res.sendStatus(500);
  }
});

app.listen(8080, () => {
  console.log("🚀 Server rodando na porta 8080");
});
