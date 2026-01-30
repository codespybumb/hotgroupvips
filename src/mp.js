import pkg from "mercadopago"
import { CONFIG } from "./config.js"

const { MercadoPagoConfig, PreApproval } = pkg

const mpClient = new MercadoPagoConfig({
  accessToken: CONFIG.MP_ACCESS_TOKEN
})

const preapproval = new PreApproval(mpClient)

export async function criarAssinatura(telegramId, email) {
  try {
    const assinatura = await preapproval.create({
      body: {
        reason: "Acesso VIP Telegram",
        external_reference: telegramId.toString(),
        payer_email: email,

        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: CONFIG.VIP_PRICE,
          currency_id: "BRL"
        },

        back_url: CONFIG.BASE_URL,
        status: "pending"
      }
    })

    return assinatura.init_point

  } catch (err) {
    console.error("❌ Erro MP assinatura:", err)
    throw new Error("Erro ao gerar assinatura")
  }
}
