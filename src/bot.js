import TelegramBot from "node-telegram-bot-api"
import { BOT_TOKEN, VIP_PRICE } from "./config.js"
import { criarPagamento } from "./mp.js"

console.log("🤖 BOT.JS CARREGADO")

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id
  const userId = msg.from.id

  try {
    console.log("👤 Criando pagamento para:", userId)

    const pagamento = await criarPagamento(userId)

    await bot.sendMessage(
      chatId,
      `🔥 BEM-VINDO AO VIP 🔥

Acesso por 30 dias
Valor: R$ ${VIP_PRICE}

Pague no link abaixo 👇`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: "💳 PAGAR AGORA", url: pagamento.link }
          ]]
        }
      }
    )
  } catch (err) {
    console.error("❌ Erro ao gerar pagamento:", err)
    await bot.sendMessage(chatId, "❌ Erro ao gerar pagamento, tente novamente.")
  }
})
