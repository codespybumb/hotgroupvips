import pkg from "mercadopago"

const mercadopago = pkg.default || pkg

const {
  MP_ACCESS_TOKEN,
  BASE_URL,
  VIP_PRICE
} = process.env

if (!MP_ACCESS_TOKEN) throw new Error("MP_ACCESS_TOKEN faltando")

const price = Number(VIP_PRICE)

if (!price || price <= 0) {
  throw new Error("VIP_PRICE inválido")
}

mercadopago.configure({
  access_token: MP_ACCESS_TOKEN
})


export async function criarAssinatura(telegramId) {
  try {

    const assinatura = await mercadopago.preapproval.create({
      reason: "Assinatura VIP Telegram",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: price,
        currency_id: "BRL"
      },
      payer_email: `user${telegramId}@example.com`,
      external_reference: telegramId.toString(),
      back_url: BASE_URL,
      status: "pending"
    })

    if (!assinatura?.body?.init_point) {
      console.log("Resposta MP:", assinatura.body)
      throw new Error("init_point não veio")
    }

    return assinatura.body.init_point

  } catch (err) {
    console.error("❌ Erro MP assinatura:", err.response?.data || err)
    throw new Error("Erro ao gerar assinatura")
  }
}
