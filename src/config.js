// src/config.js
import 'dotenv/config';

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  VIP_PRICE: Number(process.env.VIP_PRICE || 29.9),
  VIP_DAYS: Number(process.env.VIP_DAYS || 30),
  GROUP_ID: process.env.GROUP_ID,
  WEBHOOK_URL: process.env.WEBHOOK_URL
};
