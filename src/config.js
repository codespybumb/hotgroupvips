export const CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN,

  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,

  VALOR_VIP: Number(process.env.VALOR_VIP || 29.9),

  EMAIL_PADRAO: process.env.EMAIL_PADRAO || "pagamento@teste.com",

  BACK_URL: process.env.BACK_URL || "https://google.com",

  DATABASE_URL: process.env.DATABASE_URL
};
