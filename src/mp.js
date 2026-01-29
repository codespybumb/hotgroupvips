import mercadopago from "mercadopago";
import { CONFIG } from "./config.js";

console.log("🔥 MP.JS CARREGADO");

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
});

// =========================
// FUNÇÃO DATA MP (BRASIL)
// =========================
function mpDate() {
  const d = new Date();

  // força timezone Brasil
  d.setHours(d.getHours() - 3);

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

      back_url: CONFIG.BACK_URL || "https://google.com",

      payer_email: CONFIG.EMAIL_PADRAO || "teste@teste.com",

      metadata: {
        telegramId: telegramId.toString()
      }
    };

    const response = await mercadopago.preapproval.create(preapproval);

    console.log("🔥 Assinatura criada:", response.body.init_point);

    return {
      init_point: response.body.init_point,
      id: response.body.id
    };

  } catch (err) {
    console.error("❌ ERRO CRIAR ASSINATURA:", err.response?.data || err);
    throw err;
  }
}
