import mercadopago from "mercadopago"

const {
  MP_ACCESS_TOKEN,
  BASE_URL,
  VIP_PRICE
} = process.env

if (!MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN não definido")
}

if (!BASE_URL) {
  throw new Error("BASE_URL não definido")
}

const price = Number(VIP_PRICE)

if (!price || price <= 0) {
  throw new Error("VIP_PRICE inválido")
}

// ==========================
// CONFIG SDK v2
// ==========================

mercadopago.configure({
  access_token: MP_ACCESS_TOKEN
})

// ==========================
// CRIAR ASSINATURA
// ==========================

export async function criarAssinatura(telegramId) {
  try {

    const body = {
      reason: "Assinatura VIP Telegram",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: price,
        currency_id: "BRL"
      },

      // EMAIL FIXO (funciona — depois você pode melhorar)
      payer_email: `user${telegramId}@example.com`,

      external_reference: telegramId.toString(),

      back_url: BASE_URL,
      status: "pending"
    }

    const res = await mercadopago.preapproval.create({
      body
    })

    if (!res?.body?.init_point) {
      console.error("Resposta MP inválida:", res.body)
      throw new Error("init_point ausente")
    }

    return res.body.init_point

  } catch (err) {
    console.error("❌ Erro MP assinatura:", err.response?.data || err)
    throw new Error("Erro ao gerar assinatura")
  }
}
