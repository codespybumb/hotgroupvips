// src/mp.js
import mercadopago from "mercadopago"
import { CONFIG } from "./config.js"

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
})

export async function criarAssinatura(telegramId) {
  try {
    const amount = Number(CONFIG.VIP_PRICE)

    if (!amount || isNaN(amount)) {
      throw new Error("VIP_PRICE inválido")
    }

    // fallback automático se não tiver env
    const email = CONFIG.FIXED_PAYER_EMAIL || "atributosflowlab@gmail.com"

    const res = await mercadopago.preapproval.create({
      reason: "VIP Telegram",
      back_url: "https://seusite.com/obrigado",
      payer_email: email,
      external_reference: telegramId.toString(),
      status: "pending",

      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: amount,
        currency_id: "BRL"
      }
    })

    return res.body.init_point

  } catch (err) {
    console.error("❌ Erro MP assinatura:", err)
    throw new Error("Erro ao gerar assinatura")
  }
}
