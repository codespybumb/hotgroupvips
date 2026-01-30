export const CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  GROUP_ID: Number(process.env.GROUP_ID),

  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  BASE_URL: process.env.BASE_URL,

  VIP_PRICE: Number(process.env.VIP_PRICE || 29.9),
  VIP_DAYS: Number(process.env.VIP_DAYS || 30),

  PORT: Number(process.env.PORT || 8080)
}

// validações obrigatórias
const required = [
  "BOT_TOKEN",
  "GROUP_ID",
  "MP_ACCESS_TOKEN",
  "BASE_URL"
]

for (const key of required) {
  if (!CONFIG[key]) {
    throw new Error(`❌ CONFIG faltando: ${key}`)
  }
}
