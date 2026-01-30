import mercadopago from "mercadopago";
import { MP_ACCESS_TOKEN, VIP_PRICE, BASE_URL } from "./config.js";

mercadopago.configure({
  access_token: MP_ACCESS_TOKEN
});

export async function criarPagamento(telegramId) {
  const payment = await mercadopago.payment.create({
    transaction_amount: VIP_PRICE,
    description: "Acesso VIP Telegram",
    payment_method_id: "pix",
    payer: {
      email: `${telegramId}@vip.telegram`
    },
    notification_url: `${BASE_URL}/webhook`,
    metadata: { telegramId }
  });

  const tx =
    payment.body.point_of_interaction?.transaction_data;

  if (!tx) {
    throw new Error("PIX não gerado");
  }

  return {
    qrBase64: tx.qr_code_base64,
    qrCode: tx.qr_code
  };
}
