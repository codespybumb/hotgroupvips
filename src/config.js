export const BOT_TOKEN = process.env.BOT_TOKEN;
export const GROUP_ID = Number(process.env.GROUP_ID);
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

export const VIP_PRICE = 29.9;
export const VIP_DAYS = 30;
export const PORT = 8080;
export const BASE_URL = process.env.BASE_URL;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN ausente");
if (!GROUP_ID) throw new Error("GROUP_ID ausente");
if (!MP_ACCESS_TOKEN) throw new Error("MP_ACCESS_TOKEN ausente");
if (!BASE_URL) throw new Error("BASE_URL ausente");
