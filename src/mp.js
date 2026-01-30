import { MercadoPagoConfig, Payment } from "mercadopago";
import { MP_ACCESS_TOKEN, VIP_PRICE, BASE_URL } from "./config.js";

const client = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN
});

const payment = new Payment(client);

export async function criarPagamento(telegramId) {
  try {
    const result = await payment.create({
      body: {
        transaction_amount: VIP_PRICE,
        description: "Acesso VIP Telegram",
        payment_method_id: "pix",
        payer: {
          email: `${telegramId}@telegram.vip`
        },
        notification_url: `${BASE_URL}/webhook`,
        metadata: {
          telegramId
        }
      }
    });

    const tx =
      result.point_of_interaction?.transaction_data;

    if (!tx) {
      throw new Error("PIX não gerado");
    }

    return {
      qrBase64: tx.qr_code_base64,
      qrCode: tx.qr_code
    };
  } catch (err) {
    console.error("MP ERROR:", err);
    throw new Error("Erro ao criar pagamento MP");
  }
}
