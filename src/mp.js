import mercadopago from 'mercadopago'
import { CONFIG } from './config.js'

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
})

export async function criarPagamento(telegramId) {
  const pref = {
    items: [{
      title: 'VIP Telegram',
      quantity: 1,
      currency_id: 'BRL',
      unit_price: CONFIG.VALOR_VIP
    }],
    metadata: { telegramId },
    notification_url: "https://hotgroupvip-production.up.railway.app/webhook"
  }

  const res = await mercadopago.preferences.create(pref)
  return res.body
}
