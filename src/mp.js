import { MercadoPagoConfig, PreApproval } from "mercadopago";
import {
  MP_ACCESS_TOKEN,
  VALOR_VIP,
  BASE_URL,
  EMAIL_PADRAO
} from "./config.js";

const client = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN
});

const preApproval = new PreApproval(client);

export async function criarAssinatura(telegramId) {
  const res = await preApproval.create({
    reason: "Grupo VIP Telegram",
    external_reference: String(telegramId),
    payer_email: EMAIL_PADRAO || `${telegramId}@telegram.fake`,

    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: VALOR_VIP,
      currency_id: "BRL"
    },

    back_url: BASE_URL + "/obrigado",
    notification_url: BASE_URL + "/webhook"
  });

  return res.init_point;
}
