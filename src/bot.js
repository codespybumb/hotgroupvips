import TelegramBot from "node-telegram-bot-api"
import { BOT_TOKEN, VIP_PRICE } from "./config.js"
import { criarPagamento } from "./mp.js"

console.log("🤖 BOT.JS CARREGADO")

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id
  const userId = msg.from.id

  try {
    const pagamento = await criarPagamento(userId)

    await bot.sendMessage(
      chatId,
      `🔥 BEM-VINDO AO VIP 🔥

Acesso por 30 dias
Valor: R$ ${VIP_PRICE}`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: "💳 PAGAR AGORA", url: pagamento.link }
          ]]
        }
      }
    )
  } catch (err) {
    console.error(err)
    await bot.sendMessage(chatId, "❌ Erro ao gerar pagamento.")
  }
})

export default bot // ⬅️ ⬅️ ⬅️ ISSO AQUI É O QUE FALTAVA
