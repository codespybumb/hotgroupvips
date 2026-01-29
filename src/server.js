import './bot.js'   // FORÇA execução
import express from 'express'
import { CONFIG } from './config.js'

const app = express()
app.use(express.json())

app.listen(CONFIG.PORT, () => {
  console.log("🚀 Server rodando na porta", CONFIG.PORT)
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