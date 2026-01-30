// src/jobs/removeExpired.js
import bot from "../bot.js";
import { vipUsers } from "../vipStore.js";
import { GROUP_ID } from "../config.js";

export async function removeExpiredUsers() {
  const now = new Date();

  for (const [telegramId, data] of vipUsers.entries()) {
    if (data.expiresAt <= now) {
      try {
        await bot.banChatMember(GROUP_ID, telegramId);
        await bot.unbanChatMember(GROUP_ID, telegramId);
        vipUsers.delete(telegramId);
        console.log("❌ VIP removido:", telegramId);
      } catch (err) {
        console.error("Erro ao remover:", telegramId, err);
      }
    }
  }
}
