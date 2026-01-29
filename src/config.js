import dotenv from "dotenv";

dotenv.config();

export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
export const VIP_PRICE = Number(process.env.VIP_PRICE);
export const VIP_DAYS = Number(process.env.VIP_DAYS);

if (!MP_ACCESS_TOKEN) {
  throw new Error("❌ MP_ACCESS_TOKEN não definido no .env");
}

if (!VIP_PRICE || isNaN(VIP_PRICE)) {
  throw new Error("❌ VIP_PRICE inválido");
}

if (!VIP_DAYS || isNaN(VIP_DAYS)) {
  throw new Error("❌ VIP_DAYS inválido");
}
