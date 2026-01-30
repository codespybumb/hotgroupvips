// =========================
// CONFIG GLOBAL (ESM)
// =========================

// BOT
export const BOT_TOKEN = process.env.BOT_TOKEN
export const GROUP_ID = Number(process.env.GROUP_ID)

// VIP
export const VIP_PRICE = Number(process.env.VIP_PRICE || 29.9)
export const VIP_DAYS = Number(process.env.VIP_DAYS || 30)

// MERCADO PAGO
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN

// SERVER
export const PORT = Number(process.env.PORT || 8080)
export const BASE_URL = process.env.BASE_URL || "http://localhost:8080"

// =========================
// VALIDACOES
// =========================
if (!BOT_TOKEN) throw new Error("❌ BOT_TOKEN não definido")
if (!GROUP_ID) throw new Error("❌ GROUP_ID não definido")
if (!MP_ACCESS_TOKEN) throw new Error("❌ MP_ACCESS_TOKEN não definido")
