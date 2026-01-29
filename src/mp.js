import mercadopago from "mercadopago";

console.log("🔥 MP.JS CARREGADO");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export async function criarPagamento(telegramId) {
  try {
    console.log("🔥 criarPagamento chamada com:", telegramId);

    const preference = {
      items: [
        {
          title: "VIP Telegram",
          quantity: 1,
          unit_price: 29.9,
          currency_id: "BRL"
        }
      ],
      metadata: {
        telegramId: telegramId
      },
      notification_url: `${process.env.DOMAIN}/webhook`,
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);

    const link = response.body.init_point;

    console.log("🔥 pagamento criado:", link);

    return link;
  } catch (error) {
    console.error("❌ Erro ao gerar pagamento:", error);
    return null;
  }
}
