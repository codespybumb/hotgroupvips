import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { VIP_PRICE, VIP_DAYS, BASE_URL } from "./config.js";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const preApproval = new PreApproval(mpClient);

export async function criarAssinatura({ telegramId }) {
  const response = await preApproval.create({
    reason: "Acesso VIP Telegram",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: VIP_PRICE,
      currency_id: "BRL"
    },
    back_url: `${BASE_URL}/obrigado`,
    notification_url: `${BASE_URL}/webhook`,
    external_reference: telegramId.toString(),
    payer_email: `${telegramId}@telegram.fake`
  });

  return response.init_point;
}
