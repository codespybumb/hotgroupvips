// src/mp.js
import axios from 'axios';
import { config } from './config.js';

export async function criarPagamento(userId) {
  try {
    if (!config.MP_ACCESS_TOKEN) {
      throw new Error('MP_ACCESS_TOKEN não definido');
    }

    const valor = Number(config.VIP_PRICE);

    if (isNaN(valor)) {
      throw new Error('Valor inválido (NaN)');
    }

    const pagamento = {
      transaction_amount: valor,
      description: `VIP Telegram - ${config.VIP_DAYS} dias`,
      payment_method_id: 'pix',
      payer: {
        email: `user${userId}@telegram.vip`
      },
      notification_url: config.WEBHOOK_URL,
      external_reference: String(userId)
    };

    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      pagamento,
      {
        headers: {
          Authorization: `Bearer ${config.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (err) {
    console.error('❌ ERRO MP:', err.response?.data || err.message);
    return null;
  }
}
