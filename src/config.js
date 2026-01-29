// =========================
// CONFIG GLOBAL (ESM SAFE)
// =========================

// BOT
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const GROUP_ID = Number(process.env.GROUP_ID);

// MERCADO PAGO
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
export const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY || null;

// VIP
export const VIP_PRICE = Number(process.env.VIP_PRICE || 29.9);
export const VIP_DAYS = Number(process.env.VIP_DAYS || 30);

// SERVER
export const PORT = Number(process.env.PORT || 8080);
export const BACK_URL = process.env.BACK_URL || "https://google.com";

// DATABASE
export const DATABASE_URL = process.env.DATABASE_URL || null;

// =========================
// VALIDACOES (QUEBRAM O APP SE FALTAR)
// =========================

if (!BOT_TOKEN) {
  throw new Error("❌ BOT_TOKEN não definido");
}

if (!GROUP_ID) {
  throw new Error("❌ GROUP_ID não definido");
}

if (!MP_ACCESS_TOKEN) {
  throw new Error("❌ MP_ACCESS_TOKEN não definido");
}
