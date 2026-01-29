import mercadopago from 'mercadopago';

console.log('🔥 MP.JS CARREGADO');

// configura o Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

/**
 * Cria um pagamento no Mercado Pago
 * @param {string} telegramId
 */
export async function criarPagamento(telegramId) {
  try {
    console.log('🔥 criarPagamento chamada com:', telegramId);

    const preference = {
      items: [
        {
          title: 'VIP Telegram',
          quantity: 1,
          unit_price: Number(process.env.VIP_PRICE || 29.9),
          currency_id: 'BRL'
        }
      ],

      metadata: {
        telegramId
      },

      notification_url: `${process.env.DOMAIN}/webhook`
    };

    const response = await mercadopago.preferences.create(preference);

    console.log('🔥 pagamento criado:', response.body.init_point);

    return response.body.init_point;

  } catch (err) {
    console.error('❌ Erro ao criar pagamento:', err);
    throw err;
  }
}
