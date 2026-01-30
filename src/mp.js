import mercadopago from "mercadopago"
import { CONFIG } from "./config.js"

console.log("💳 MP.JS CARREGADO")

// ========================
// CONFIGURA SDK
// ========================

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
})


// ========================
// CRIAR ASSINATURA RECORRENTE
// ========================

export async function criarAssinatura(telegramId) {
  try {

    console.log("👤 Criando assinatura para:", telegramId)

    const assinatura = await mercadopago.preapproval.create({
      body: {
        reason: "Acesso VIP Telegram",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: CONFIG.VIP_PRICE,
          currency_id: "BRL"
        },

        payer_email: `${telegramId}@vip-bot.local`,

        back_url: `${CONFIG.BASE_URL}/sucesso`,

        notification_url: `${CONFIG.BASE_URL}/webhook`,

        external_reference: telegramId.toString()
      }
    })

    console.log("✅ Assinatura criada:", assinatura.body.id)

    return {
      id: assinatura.body.id,
      url: assinatura.body.init_point
    }

  } catch (err) {

    console.error("❌ ERRO MP:", err?.response?.data || err.message)

    throw new Error("Erro ao gerar assinatura MP")
  }
}

