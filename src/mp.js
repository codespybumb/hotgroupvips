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
// DATA FUTURA COMPATÍVEL MP
// =========================
function mpDate() {
  const d = new Date(Date.now() + 5 * 60 * 1000); // +5 minutos

  const pad = n => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const min = pad(d.getMinutes());
  const sec = pad(d.getSeconds());

  return `${year}-${month}-${day}T${hour}:${min}:${sec}.000-03:00`;
}

// =========================
// CRIAR ASSINATURA
// =========================
export async function criarPagamento(telegramId) {
  try {
    console.log("👤 Criando pagamento para:", telegramId);

    const preapproval = {
      reason: "Assinatura VIP Telegram",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: Number(CONFIG.VALOR_VIP),
        currency_id: "BRL",
        start_date: mpDate()
      },
      back_url: CONFIG.BACK_URL,
      payer_email: CONFIG.EMAIL_PADRAO,
      metadata: {
        telegramId: telegramId.toString()
      }
    };

    const response = await mercadopago.preapproval.create(preapproval);

    console.log("✅ Assinatura criada:", response.body.init_point);

    return {
      init_point: response.body.init_point,
      id: response.body.id
    };

  } catch (err) {
    console.error("❌ ERRO MP:", err.response?.data || err);
    throw err;
  }
}
