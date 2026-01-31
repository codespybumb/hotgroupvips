import mercadopago from "mercadopago"
import { CONFIG } from "./config.js"

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
})

export async function criarAssinatura(telegramId) {

  const response = await mercadopago.preapproval.create({
    reason: "VIP Telegram",

    external_reference: String(telegramId), // 👈 ESSENCIAL

    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: CONFIG.VIP_PRICE,
      currency_id: "BRL"
    },

    payer_email: CONFIG.FIXED_PAYER_EMAIL,
    back_url: "https://google.com"
  })

  return {
    url: response.body.init_point,
    id: response.body.id
  }
}


export async function getPreapproval(id) {
  const resp = await mercadopago.preapproval.get(id)
  return resp.body
}
