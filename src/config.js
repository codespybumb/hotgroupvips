export const CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN || "8437193511:AAGJGTUVHfEdH3XWkbEUE8NWJmBt33PmDU0",

  GROUP_ID: Number(process.env.GROUP_ID) || -1003579898334,

  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN || "APP_USR-4238236976690565-012816-b56436b2ccb6f9b6e40c7d4d631098f9-1837916299",

  MP_PUBLIC_KEY: process.env.MP_PUBLIC_KEY || "APP_USR-7cddfa89-c985-4d0d-87ee-4a5f5c8d7774",

  VALOR_VIP: Number(process.env.VALOR_VIP) || 29.9,
  DIAS_VIP: Number(process.env.DIAS_VIP) || 30,

  EMAIL_PADRAO: process.env.EMAIL_PADRAO || "teste@teste.com",
  BACK_URL: process.env.BACK_URL || "https://google.com",

  PORT: Number(process.env.PORT) || 8080,

  DATABASE_URL: process.env.DATABASE_URL
};
