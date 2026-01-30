import mercadopago from "mercadopago";
import { config } from "./config.js";

mercadopago.configure({
  access_token: config.MP_ACCESS_TOKEN
});

export async function criarAssinatura(userId) {
  try {
    const response = await mercadopago.preapproval.create({
      reason: "VIP Telegram",
      external_reference: String(userId),
      payer_email: config.EMAIL_PADRAO,

      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: config.VALOR_VIP,
        currency_id: "BRL"
      },

      back_url: "https://google.com",
      notification_url: `${config.BASE_URL}/webhook`,
      status: "pending"
    });

    return response.body.init_point;

  } catch (err) {
    console.error("MP ERRO REAL:", err.response?.data || err);
    throw new Error("Erro ao gerar assinatura");
  }
}
