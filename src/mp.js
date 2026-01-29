import axios from "axios"
import * as config from "./config.js"

// =========================
// CLIENTE MERCADO PAGO
// =========================

const mp = axios.create({
  baseURL: "https://api.mercadopago.com",
  headers: {
    Authorization: `Bearer ${config.MP_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
})

// =========================
// CRIAR PAGAMENTO
// =========================

export async function criarPagamento({ userId }) {
  try {
    const preference = {
      items: [
        {
          title: "Acesso VIP Telegram",
          quantity: 1,
          unit_price: config.VIP_PRICE,
          currency_id: "BRL",
        },
      ],
      metadata: {
        telegram_id: userId,
      },
      external_reference: String(userId),
      notification_url: `${config.BASE_URL}/webhook/mp`,
      auto_return: "approved",
    }

    const res = await mp.post("/checkout/preferences", preference)

    return {
      id: res.data.id,
      link: res.data.init_point,
    }
  } catch (err) {
    console.error("❌ Erro MP:", err.response?.data || err.message)
    throw new Error("Erro ao gerar pagamento")
  }
}

// =========================
// PROCESSAR WEBHOOK
// =========================

export async function processarWebhook(paymentId) {
  try {
    const res = await mp.get(`/v1/payments/${paymentId}`)
    const payment = res.data

    if (payment.status !== "approved") {
      return null
    }

    const telegramId = payment.metadata.telegram_id
    if (!telegramId) {
      throw new Error("Pagamento sem telegram_id")
    }

    const agora = new Date()
    const expiraEm = new Date(
      agora.getTime() + config.VIP_DAYS * 24 * 60 * 60 * 1000
    )

    return {
      telegramId,
      paymentId: payment.id,
      status: payment.status,
      paidAt: agora,
      expiresAt: expiraEm,
    }
  } catch (err) {
    console.error("❌ Erro webhook MP:", err.response?.data || err.message)
    throw err
  }
}
