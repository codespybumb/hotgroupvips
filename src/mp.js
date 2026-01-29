import fetch from 'node-fetch'
import { CONFIG } from './config.js'

console.log("🔥 MP.JS CARREGADO")

export async function criarPagamento(telegramId) {
  console.log("🔥 criarPagamento chamada com:", telegramId)

  // força erro proposital
  throw new Error("TESTE MP FUNCIONOU")
}



export async function criarPagamento(telegramId) {
  try {
    const res = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CONFIG.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            {
              title: 'Acesso VIP Telegram',
              quantity: 1,
              currency_id: 'BRL',
              unit_price: CONFIG.VALOR_VIP
            }
          ],
          metadata: {
            telegramId: telegramId.toString()
          },
          back_urls: {
            success: 'https://google.com',
            failure: 'https://google.com',
            pending: 'https://google.com'
          },
          auto_return: 'approved'
        })
      }
    )

    const data = await res.json()

    if (!data.init_point) {
      console.error('❌ MP RESPONSE:', data)
      throw new Error('init_point não gerado')
    }

    return data
  } catch (err) {
    console.error('❌ ERRO MP:', err)
    throw err
  }
}
