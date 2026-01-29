import './bot.js'   // FORÇA execução
import express from 'express'
import { CONFIG } from './config.js'
import { bot } from './bot.js'


const GRUPO_VIP_ID = -1003579898334
const app = express()
app.use(express.json())

app.listen(CONFIG.PORT, () => {
  console.log("🚀 Server rodando na porta", CONFIG.PORT)
})
app.post('/webhook', async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
  payment = {
    status: 'approved',
    metadata: {
      telegramId: '8405584249'
    }
  }
}

  try {
    const paymentId = req.body?.data?.id
    if (!paymentId) {
      return res.sendStatus(200)
    }

    const payment = await mercadopago.payment.get(paymentId)

    if (payment.body.status === 'approved') {
      const telegramId = payment.body.metadata?.telegramId

      if (!telegramId) {
        console.error('❌ telegramId não encontrado no pagamento')
        return res.sendStatus(200)
      }

      // adiciona no grupo
      await bot.addChatMember(GRUPO_VIP_ID, telegramId)

      // mensagem de confirmação
      await bot.sendMessage(
        telegramId,
        '✅ Pagamento aprovado! Você foi adicionado ao grupo VIP.'
      )

      console.log('🔥 Usuário adicionado ao grupo:', telegramId)
    }

    res.sendStatus(200)
  } catch (err) {
    console.error('❌ Erro no webhook:', err)
    res.sendStatus(500)
    console.log('🔥 WEBHOOK RECEBIDO:', req.body)
  }
})
