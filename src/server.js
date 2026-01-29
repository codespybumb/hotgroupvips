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
  let payment

  // 🔵 MODO TESTE
  if (process.env.NODE_ENV === 'test') {
    console.log('🧪 MODO TESTE ATIVO')

    payment = {
      status: 'approved',
      metadata: {
        telegramId: '8405584249' // TEU TELEGRAM ID
      }
    }
  } else {
    // 🔴 PRODUÇÃO (Mercado Pago real)
    const paymentId = req.body?.data?.id
    payment = await mp.payment.findById(paymentId)
  }

  console.log('💰 PAYMENT:', payment)

  if (payment.status === 'approved') {
    await liberarAcesso(payment)
  }

  res.sendStatus(200)
})
