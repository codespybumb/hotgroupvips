import TelegramBot from "node-telegram-bot-api"
import config from "./config.js"
import { criarAssinatura } from "./mp.js"

console.log("🤖 BOT.JS CARREGADO")

const bot = new TelegramBot(config.TELEGRAM_TOKEN, {
  polling: true
})

bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id

  try {
    const link = await criarAssinatura(chatId)

    await bot.sendMessage(
      chatId,
`🔥 ACESSO VIP 🔥

Valor: R$ ${config.VIP_PRICE}
Validade: 30 dias

👉 ${link}`
    )
  } catch (err) {
    console.error(err)
    bot.sendMessage(chatId, "❌ Erro ao gerar pagamento.")
  }
})

export default bot
