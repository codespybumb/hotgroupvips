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
      // EMAIL FIXO (funciona — depois você pode melhorar)
      
      payer_email: `user${telegramId}@example.com`,

      external_reference: telegramId.toString(),

      back_url: BASE_URL,
      status: "pending"
    }

    const res = await mercadopago.preapproval.create({
      body
    })

  console.log("🔥 pagamento criado:", response.body.init_point)

  return response.body
}
