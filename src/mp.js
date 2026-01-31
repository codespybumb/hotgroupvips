import pkg from "mercadopago"

const mercadopago = pkg.default || pkg

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
})

export async function criarAssinatura(telegramId) {
  const price = Number(process.env.VIP_PRICE)

  const assinatura = await mercadopago.preapproval.create({
    reason: "VIP Telegram",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: price,
      currency_id: "BRL"
    },
    payer_email: `user${telegramId}@example.com`,
    external_reference: telegramId.toString(),
    back_url: process.env.BASE_URL,
    status: "pending"
  })

  return assinatura.body.init_point
}

export async function getPreapproval(id) {
  const res = await mercadopago.preapproval.get(id)
  return res.body
}
