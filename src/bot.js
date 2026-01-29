import TelegramBot from 'node-telegram-bot-api'
import { CONFIG } from './config.js'

console.log("🤖 BOT.JS CARREGADO")

export const bot = new TelegramBot(CONFIG.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true
  }
})

bot.deleteWebHook()

console.log("🤖 BOT INICIALIZADO, POLLING ATIVO")

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `🔥 BEM-VINDO AO VIP 🔥

Acesso por ${CONFIG.DIAS_VIP} dias
Valor: R$ ${CONFIG.VALOR_VIP}

Digite /vip para assinar.`
  )
})

bot.on('polling_error', err => {
  console.error("❌ POLLING ERROR:", err.message)
})
