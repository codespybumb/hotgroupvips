import mercadopago from "mercadopago"
import { CONFIG } from "./config.js"

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
})

export async function criarAssinatura(telegramId) {
  const res = await mercadopago.preapproval.create({
    reason: "VIP Telegram",
    external_reference: String(telegramId),
    payer_email: CONFIG.FIXED_PAYER_EMAIL,
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: CONFIG.VIP_PRICE,
      currency_id: "BRL"
    },
    back_url: "https://google.com"
  })

  return {
    url: res.body.init_point,
    id: res.body.id
  }
}

export async function getPreapproval(preapprovalId) {
  const res = await mercadopago.preapproval.get(preapprovalId)
  return res.body
}

export async function criarPagamentoVitalicio(telegramId, valor) {
  const res = await mercadopago.preferences.create({
    items: [
      {
        title: "VIP Vitalício",
        quantity: 1,
        unit_price: valor
      }
    ],
    external_reference: String(telegramId),
    payment_methods: {
      excluded_payment_types: [],
      installments: 12
    },
    back_urls: {
      success: "https://google.com"
    }
  })

  return {
    url: res.body.init_point,
    id: res.body.id
  }
}
// ==========================
// PAGAMENTO 6 MESES (único)
// ==========================

export async function criarPagamentoSemestral(telegramId, valor) {
  const res = await mercadopago.preferences.create({
    items: [
      {
        title: "VIP 6 Meses",
        quantity: 1,
        unit_price: valor
      }
    ],
    external_reference: String(telegramId),
    payment_methods: {
      installments: 12
    },
    back_urls: {
      success: "https://google.com"
    }
  })

  return {
    url: res.body.init_point,
    id: res.body.id
  }
}


// ==========================
// PEGAR PAGAMENTO (para webhook)
// ==========================

export async function getPayment(paymentId) {
  const res = await mercadopago.payment.findById(paymentId)
  return res.body
}
