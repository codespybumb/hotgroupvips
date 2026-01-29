export const CONFIG = {
  // =========================
  // BOT / TELEGRAM
  // =========================
  BOT_TOKEN: process.env.BOT_TOKEN,
  GROUP_ID: Number(process.env.GROUP_ID),

  // =========================
  // MERCADO PAGO
  // =========================
  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  MP_PUBLIC_KEY: process.env.MP_PUBLIC_KEY,

  // =========================
  // ASSINATURA
  // =========================
  VALOR_VIP: Number(process.env.VALOR_VIP || 29.9),
  DIAS_VIP: Number(process.env.DIAS_VIP || 30),

  // =========================
  // RECORRENTE (novo)
  // =========================
  BACK_URL: process.env.BACK_URL || "https://google.com",
  EMAIL_PADRAO: process.env.EMAIL_PADRAO || "teste@teste.com",

  // =========================
  // SERVER
  // =========================
  PORT: Number(process.env.PORT || 8080),

  // =========================
  // DATABASE
  // =========================
  DATABASE_URL: process.env.DATABASE_URL
};
