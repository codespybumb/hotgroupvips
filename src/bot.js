import TelegramBot from "node-telegram-bot-api"
import { CONFIG } from "./config.js"
import { criarAssinatura } from "./mp.js"

console.log("🤖 BOT.JS CARREGADO")

// ======================
// INICIA BOT
// ======================

const bot = new TelegramBot(CONFIG.BOT_TOKEN, {
  polling: true
})

console.log("🤖 BOT INICIALIZADO, POLLING ATIVO")

// ======================
// /start
// ======================

bot.onText(/\/start/, async (msg) => {

  const chatId = msg.chat.id

  await bot.sendMessage(chatId,
`🔥 Bem-vindo ao VIP

Use /vip para assinar acesso ao grupo exclusivo.

Pagamento recorrente automático
Cartão crédito/débito`
  )

})


// ======================
// /vip — gerar assinatura
// ======================

bot.onText(/\/vip/, async (msg) => {

  const chatId = msg.chat.id
  const telegramId = msg.from.id

  try {

    await bot.sendMessage(chatId, "⏳ Gerando assinatura...")

    const link = await criarAssinatura(telegramId)

    if (!link) {
      throw new Error("Link não retornado pelo MP")
    }

    await bot.sendMessage(chatId,
`💎 Assinatura VIP

Valor: R$ ${CONFIG.VIP_PRICE}/mês

Clique para pagar:
${link}`
    )

  } catch (err) {

    console.error("Erro /vip:", err)

    await bot.sendMessage(chatId,
      "❌ Erro ao gerar assinatura. Tente novamente."
    )
  }

})


// ======================
// EXPORT BOT
// ======================

export default bot
