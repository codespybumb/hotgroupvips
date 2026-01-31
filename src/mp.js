// src/mp.js
import mercadopago from "mercadopago"
import { CONFIG } from "./config.js"

console.log("🔥 MP.JS CARREGADO")

// SDK v1.x
mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
})

export async function criarAssinatura(telegramId) {
  try {
    const amount = Number(CONFIG.VIP_PRICE)
    if (!amount || isNaN(amount)) {
      throw new Error("VIP_PRICE inválido")
    }

    const res = await mercadopago.preapproval.create({
      reason: "Assinatura VIP Telegram",
      payer_email: CONFIG.FIXED_PAYER_EMAIL, // pode ser fixo
      external_reference: telegramId.toString(),
      back_url: CONFIG.SUCCESS_URL,          // url de retorno opcional
      status: "pending",

      auto_recurring: {
        frequency: 1,
        frequency_type: "months",           // "days" | "months"
        transaction_amount: amount,
        currency_id: "BRL"
      }
    })

    const link = res.body.init_point
    if (!link) throw new Error("init_point ausente")

    console.log("✅ Assinatura criada:", link)
    return link

  } catch (err) {
    console.error("❌ Erro MP assinatura:", err)
    throw new Error("Erro ao gerar assinatura")
  }
}
