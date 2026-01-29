import axios from "axios";
import * as config from "./config.js"

const mp = axios.create({
  baseURL: "https://api.mercadopago.com",
  headers: {
    Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  }
});

export async function criarPagamento(userId) {
  try {
    const response = await mp.post("/checkout/preferences", {
      items: [
        {
          title: "Acesso VIP",
          quantity: 1,
          currency_id: "BRL",
          unit_price: VIP_PRICE
        }
      ],
      external_reference: String(userId),
      payment_methods: {
        excluded_payment_types: [{ id: "ticket" }]
      }
    });

    return response.data.init_point;
  } catch (err) {
    console.error("❌ ERRO MP:", err.response?.data || err.message);
    return null;
  }
}
