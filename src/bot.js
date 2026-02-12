import TelegramBot from "node-telegram-bot-api"
import { CONFIG } from "./config.js"
import {
  criarAssinatura,
  criarPagamentoSemestral,
  criarPagamentoVitalicio
} from "./mp.js"

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

Escolha seu plano com /vip`
  )

})


// ======================
// /vip — MOSTRAR PLANOS
// ======================

bot.onText(/\/vip/, async (msg) => {

  const chatId = msg.chat.id

  await bot.sendMessage(chatId,
`💎 Escolha seu plano:`,
{
  reply_markup: {
    inline_keyboard: [
      [
        { text: "💳 Mensal - R$ 9,90", callback_data: "mensal" }
      ],
      [
        { text: "📆 6 Meses - R$ 149,90", callback_data: "semestral" }
      ],
      [
        { text: "👑 Vitalício - R$ 297,00", callback_data: "vitalicio" }
      ]
    ]
  }
})

})


// ======================
// BOTÕES
// ======================

bot.on("callback_query", async (query) => {

  const chatId = query.message.chat.id
  const telegramId = query.from.id
  const escolha = query.data

  await bot.answerCallbackQuery(query.id)

  try {

    await bot.sendMessage(chatId, "⏳ Gerando link de pagamento...")

    // 🔵 MENSAL
    if (escolha === "mensal") {

      const assinatura = await criarAssinatura(telegramId)

      await bot.sendMessage(chatId,
`💳 Plano Mensal

Valor: R$ ${CONFIG.VIP_PRICE}/mês

Clique para pagar:
${assinatura.url}`
      )
    }

    // 🟢 6 MESES
    if (escolha === "semestral") {

      const pagamento = await criarPagamentoSemestral(
        telegramId,
        149.90
      )

      await bot.sendMessage(chatId,
`📆 Plano 6 Meses

Pagamento único
R$ 149,90

Clique para pagar:
${pagamento.url}`
      )
    }

    // 👑 VITALÍCIO
    if (escolha === "vitalicio") {

      const pagamento = await criarPagamentoVitalicio(
        telegramId,
        297.00
      )

      await bot.sendMessage(chatId,
`👑 Plano Vitalício

Acesso para sempre
PIX ou Cartão

R$ 297,00

Clique para pagar:
${pagamento.url}`
      )
    }

  } catch (err) {

    console.error("Erro pagamento:", err)

    await bot.sendMessage(chatId,
      "❌ Erro ao gerar pagamento. Tente novamente."
    )
  }

})


// ======================
// EXPORT
// ======================

export default bot
