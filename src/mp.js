import pkg from "mercadopago"
import { CONFIG } from "./config.js"

const { MercadoPagoConfig, PreApproval } = pkg

const client = new MercadoPagoConfig({
  accessToken: CONFIG.MP_ACCESS_TOKEN
})

const preapproval = new PreApproval(client)

export async function criarAssinatura(telegramId) {
  try {

    const valor = Number(CONFIG.VIP_PRICE)

    if (!valor || isNaN(valor)) {
      throw new Error("VIP_PRICE inválido")
    }

    const assinatura = await preapproval.create({
      body: {
        reason: "Acesso VIP Telegram",

        payer_email: "vip@seudominio.com",

        external_reference: telegramId.toString(),

        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: valor,
          currency_id: "BRL"
        },

        back_url: CONFIG.BASE_URL,
        status: "pending"
      }
    })

    console.log("✅ Assinatura criada:", assinatura.init_point)

    return assinatura.init_point

  } catch (err) {
    console.error("❌ Erro MP assinatura:", err)
    throw new Error("Erro ao gerar assinatura")
  }
}
