import TelegramBot from 'node-telegram-bot-api'
import { CONFIG } from './config.js'
import { criarPagamento } from './mp.js'

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

bot.onText(/\/vip/, async (msg) => {
  try {
    const pagamento = await criarPagamento(msg.from.id)
    console.log("PAGAMENTO:", pagamento)

    bot.sendMessage(
      msg.chat.id,
      `💳 Pague aqui:\n${pagamento.init_point}`
    )
  } catch (err) {
    console.error("ERRO REAL MP:", err)
    bot.sendMessage(msg.chat.id, "❌ Erro ao gerar pagamento")
  }
})

app.post('/webhook', async (req, res) => {
  try {
    console.log('📩 Webhook recebido:', req.body)

    const paymentId = req.body?.data?.id
    if (!paymentId) return res.sendStatus(200)

    const payment = await mercadopago.payment.get(paymentId)

    if (payment.body.status === 'approved') {
      const telegramId = payment.body.metadata.telegramId

      if (!telegramId) {
        console.log('❌ telegramId não encontrado')
        return res.sendStatus(200)
      }

      // 🔓 AQUI VOCÊ LIBERA O VIP
      await bot.telegram.sendMessage(
        telegramId,
        '✅ Pagamento aprovado! Você agora é VIP.'
      )

      // 👉 opcional: adicionar ao grupo
      // await bot.telegram.unbanChatMember(GRUPO_ID, telegramId)
    }

    res.sendStatus(200)
  } catch (err) {
    console.error('❌ Erro no webhook:', err)
    res.sendStatus(500)
  }
})
