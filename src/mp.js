import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
})

export async function criarPagamento(telegramId) {
  const pref = {
    items: [{
      title: 'VIP Telegram',
      quantity: 1,
      currency_id: 'BRL',
      unit_price: Number(process.env.VALOR_VIP)
    }],
    metadata: { telegramId },
    notification_url: 'https://hotgroupvip-production.up.railway.app/webhook'
  }

  const res = await mercadopago.preferences.create(pref)
  return res.body
}
