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