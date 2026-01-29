export const CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  GROUP_ID: Number(process.env.GROUP_ID),

  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  MP_PUBLIC_KEY: process.env.MP_PUBLIC_KEY,

  VALOR_VIP: Number(process.env.VALOR_VIP || 29.9),
  DIAS_VIP: Number(process.env.DIAS_VIP || 30),

  PORT: Number(process.env.PORT || 8080),
  DATABASE_URL: process.env.DATABASE_URL
};
