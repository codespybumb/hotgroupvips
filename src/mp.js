import mercadopago from "mercadopago";
import { CONFIG } from "./config.js";

console.log("🔥 MP.JS CARREGADO");

// =========================
// CONFIG MERCADO PAGO
// =========================
mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
});

// =========================
// DATA NO FORMATO DO MP
// =========================
function mpDate() {
  const d = new Date();
  const tzOffset = -d.getTimezoneOffset();
  const sign = tzOffset >= 0 ? "+" : "-";

  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, "0");

  return (
    d.getFullYear() +
    "-" + pad(d.getMonth() + 1) +
    "-" + pad(d.getDate()) +
    "T" + pad(d.getHours()) +
    ":" + pad(d.getMinutes()) +
    ":" + pad(d.getSeconds()) +
    ".000" +
    sign + pad(tzOffset / 60) +
    ":" + pad(tzOffset % 60)
  );
}

// =========================
// CRIAR ASSINATURA
// =========================
export async function criarPagamento(telegramId) {
  try {
    console.log("🔥 criarPagamento chamada com:", telegramId);

    const preapproval = {
      reason: "Assinatura VIP Telegram",

      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: Number(CONFIG.VALOR_VIP),
        currency_id: "BRL",
        start_date: mpDate()
      },

      back_url: CONFIG.BACK_URL || "https://google.com",

      payer_email: CONFIG.EMAIL_PADRAO || "teste@teste.com",

      metadata: {
        telegramId: telegramId.toString()
      }
    };

    const response = await mercadopago.preapproval.create(preapproval);

    console.log("🔥 assinatura criada:", response.body.init_point);

    return {
      init_point: response.body.init_point,
      id: response.body.id
    };

  } catch (err) {
    console.error("❌ ERRO CRIAR ASSINATURA:", err.response?.data || err);
    throw err;
  }
}
