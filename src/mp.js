import mercadopago from 'mercadopago'
import { CONFIG } from './config.js'

console.log("🔥 MP.JS CARREGADO")

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
})

export async function criarPagamento(telegramId) {
  console.log("🔥 criarPagamento chamada com:", telegramId)

  const preference = {
    items: [
      {
        title: 'VIP Telegram',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: Number(CONFIG.VALOR_VIP)
      }
    ],
    metadata: {
      telegramId: telegramId.toString()
    }
  }

  const response = await mercadopago.preferences.create(preference)

  console.log("🔥 pagamento criado:", response.body.init_point)

  return response.body
}
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