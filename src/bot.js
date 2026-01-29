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
bot.onText(/\/vip/, async (msg) => {
  try {
    const preference = {
      items: [
        {
          title: 'Acesso VIP Telegram',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: CONFIG.VALOR_VIP
        }
      ],
      metadata: {
        telegramId: msg.from.id
      }
    }

    const mp = new MercadoPago(CONFIG.MP_ACCESS_TOKEN)
    const response = await mp.preferences.create(preference)

    bot.sendMessage(
      msg.chat.id,
`💳 ASSINATURA VIP

Acesso por ${CONFIG.DIAS_VIP} dias
Valor: R$ ${CONFIG.VALOR_VIP}

👉 Pague aqui:
${response.body.init_point}`
    )

  } catch (err) {
    console.error(err)
    bot.sendMessage(msg.chat.id, '❌ Erro ao gerar pagamento, tente novamente.')
  }
})
