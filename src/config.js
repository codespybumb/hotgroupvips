export const CONFIG = {
  
  BOT_TOKEN: process.env.BOT_TOKEN,

  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,

  VALOR_VIP: Number(process.env.VALOR_VIP) || 29.9,

  DIAS_VIP: Number(process.env.DIAS_VIP) || 30,

  EMAIL_PADRAO: "teste@teste.com",
  BACK_URL: "https://google.com"
};


  // =========================
  // SERVER
  // =========================
  PORT: Number(process.env.PORT || 8080),

  // =========================
  // DATABASE
  // =========================
  DATABASE_URL: process.env.DATABASE_URL
};
