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
// CRIAR ASSINATURA RECORRENTE
// =========================

export async function criarPagamento(telegramId) {
  try {
    console.log("🔥 criarAssinatura chamada com:", telegramId);

    const preapproval = {
      reason: "Assinatura VIP Telegram",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: Number(CONFIG.VALOR_VIP) || 29.9
        currency_id: "BRL"
      },

      back_url: CONFIG.BACK_URL || "https://google.com", // pode trocar depois

      payer_email: CONFIG.EMAIL_PADRAO || "teste@teste.com", 
      // MP exige email — depois podemos melhorar isso

      metadata: {
        telegramId: telegramId.toString()
      }
    };

    const response = await mercadopago.preapproval.create(preapproval);

    console.log("🔥 assinatura criada:", response.body.init_point);

    return {
      link: response.body.init_point,
      id: response.body.id
    };

  } catch (err) {
    console.error("❌ ERRO CRIAR ASSINATURA:", err);
    throw err;
  }
}
