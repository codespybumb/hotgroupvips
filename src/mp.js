import { MercadoPagoConfig, PreApproval } from "mercadopago"
import { MP_ACCESS_TOKEN, BASE_URL, VIP_PRICE } from "./config.js"

const client = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN
})

const preapproval = new PreApproval(client)

export async function criarAssinatura(telegramId) {
  try {
    const assinatura = await preapproval.create({
      body: {
        reason: "Acesso VIP Telegram",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: VIP_PRICE,
          currency_id: "BRL"
        },
        back_url: BASE_URL,
        status: "pending",
        external_reference: String(telegramId)
      }
    })

    return assinatura.init_point

  } catch (err) {
    console.error("❌ ERRO MP:", err)
    throw new Error("Erro ao gerar assinatura")
  }
}
