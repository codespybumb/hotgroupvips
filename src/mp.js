import mercadopago from 'mercadopago'
import { CONFIG } from './config.js'

console.log("🔥 MP.JS CARREGADO")

mercadopago.configure({
  access_token: CONFIG.MP_ACCESS_TOKEN
})

export async function criarPagamento(telegramId) {
  console.log("🔥 criarPagamento chamada com:", telegramId)

const preference = {
  items: [
    {
      title: 'VIP Telegram',
      quantity: 1,
      unit_price: 29.9
    }
  ],
  metadata: {
    telegramId
  },
  notification_url: "https://SEU_DOMINIO/webhook",
  sandbox_init_point: true
};

