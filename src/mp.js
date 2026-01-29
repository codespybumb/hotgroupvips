import mercadopago from "mercadopago";
import { CONFIG } from "./config.js";

console.log("🔥 MP.JS CARREGADO");

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
});

// =========================
// FUNÇÃO DATA MP
// =========================
function mpDate() {
  const d = new Date(Date.now() - 3 * 60 * 60 * 1000); // UTC-3 fixo
  return d.toISOString().replace("Z", "-03:00");
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

      payer_email: CONFIG.EMAIL_PADRAO,
      back_url: CONFIG.BACK_URL,

      metadata: {
        telegramId: telegramId.toString()
      }
    };

    const response = await mercadopago.preapproval.create(preapproval);

    console.log("🔥 ASSINATURA CRIADA:", response.body.init_point);

    return {
      link: response.body.init_point,
      id: response.body.id
    };

  } catch (err) {
    console.error("❌ ERRO MP:", err.response?.data || err);
    throw err;
  }
}
