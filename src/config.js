// src/config.js

export const CONFIG = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  VIP_GROUP_ID: process.env.VIP_GROUP_ID,

  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,

  VIP_PRICE: Number(process.env.VIP_PRICE || 29.9),

  FIXED_PAYER_EMAIL:
    process.env.FIXED_PAYER_EMAIL || "atributosflowlab@gmail.com"
}
