export const CONFIG = {
  PORT: Number(process.env.PORT || 8080),

  BOT_TOKEN: process.env.BOT_TOKEN,
  GROUP_ID: Number(process.env.GROUP_ID),

  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,

  BASE_URL: process.env.BASE_URL,

  VIP_PRICE: Number(process.env.VIP_PRICE || 29.9),
  VIP_DAYS: Number(process.env.VIP_DAYS || 30)
}

// validações
if (!CONFIG.BOT_TOKEN) throw new Error("BOT_TOKEN faltando")
if (!CONFIG.GROUP_ID) throw new Error("GROUP_ID faltando")
if (!CONFIG.MP_ACCESS_TOKEN) throw new Error("MP_ACCESS_TOKEN faltando")
if (!CONFIG.BASE_URL) throw new Error("BASE_URL faltando")
