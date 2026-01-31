import mercadopago from "mercadopago"
import { CONFIG } from "./config.js"

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
})

export async function criarAssinatura() {
  try {
    const response = await mercadopago.preapproval.create({
      reason: "VIP Telegram",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: CONFIG.VIP_PRICE,
        currency_id: "BRL"
      },
      payer_email: CONFIG.FIXED_PAYER_EMAIL,
      back_url: "https://google.com"
    })

    console.log("MP RESPONSE:", response.body)

    return response.body.init_point // 👈 ESSA LINHA
  } catch (err) {
    console.error("❌ Erro MP assinatura:", err)
    throw new Error("Erro ao gerar assinatura")
  }
}
