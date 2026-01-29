import TelegramBot from 'node-telegram-bot-api'
import { CONFIG } from './config.js'

console.log('🤖 BOT.JS CARREGADO')

// Inicializa o bot com polling
export const bot = new TelegramBot(CONFIG.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true
  }
})

// Garante que não tem webhook antigo
bot.deleteWebhook()

console.log('🤖 BOT INICIALIZADO, POLLING ATIVO')

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`🔥 BEM-VINDO AO VIP 🔥

Acesso por ${CONFIG.DIAS_VIP} dias
Valor: R$ ${CONFIG.VALOR_VIP}

Digite /vip para assinar 👇`
  )
})

// /vip
bot.onText(/\/vip/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`💳 ASSINATURA VIP

Plano: ${CONFIG.DIAS_VIP} dias
Valor: R$ ${CONFIG.VALOR_VIP}

👉 Pagamento será liberado em instantes.`
  )
})

// Log de erros de polling
bot.on('polling_error', (err) => {
  console.error('❌ POLLING ERROR:', err.message)
})
