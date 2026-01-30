export const BOT_TOKEN = process.env.BOT_TOKEN;
export const GROUP_ID = Number(process.env.GROUP_ID);

export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
export const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY;

export const BASE_URL = process.env.BASE_URL;
export const BACK_URL = process.env.BACK_URL;

export const VALOR_VIP = Number(
  String(process.env.VALOR_VIP).replace(",", ".")
);

export const DIAS_VIP = Number(process.env.DIAS_VIP || 30);
export const EMAIL_PADRAO = process.env.EMAIL_PADRAO;

export const PORT = Number(process.env.PORT || 8080);

if (!BOT_TOKEN) throw new Error("BOT_TOKEN faltando");
if (!GROUP_ID) throw new Error("GROUP_ID faltando");
if (!MP_ACCESS_TOKEN) throw new Error("MP_ACCESS_TOKEN faltando");
if (!BASE_URL) throw new Error("BASE_URL faltando");
