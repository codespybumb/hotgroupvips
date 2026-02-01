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

  bot.onText(/\/vipadm/, (msg) => {
  const chatId = msg.chat.id

  const LINK_DO_GRUPO = "https://t.me/SEU_GRUPO_AQUI"

  bot.sendMessage(
    chatId,
    `✅ *Acesso VIP liberado (TESTE)*

🎉 Liberação simulada com sucesso.

👉 Entre no grupo VIP:
${LINK_DO_GRUPO}`,
    { parse_mode: "Markdown" }
  )
})


// ======================
// EXPORT BOT
// ======================

export default bot
