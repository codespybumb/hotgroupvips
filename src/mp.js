// src/mp.js
import fetch from "node-fetch";
import { MP_ACCESS_TOKEN, VIP_PRICE } from "./config.js";

export async function criarPagamento({ telegramId }) {
  const res = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      transaction_amount: VIP_PRICE,
      description: "Acesso VIP Telegram",
      payment_method_id: "pix",
      metadata: { telegramId }
    })
  });

  const data = await res.json();

  if (!data.point_of_interaction) {
    throw new Error("Erro ao criar pagamento MP");
  }

  return {
    qrCode: data.point_of_interaction.transaction_data.qr_code,
    qrCodeBase64:
      data.point_of_interaction.transaction_data.qr_code_base64
  };
}
