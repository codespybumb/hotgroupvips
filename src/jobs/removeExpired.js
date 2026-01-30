import bot from "../bot.js";
import { vipUsers } from "../vipStore.js";
import { GROUP_ID } from "../config.js";

export async function removeExpiredUsers() {
  const now = new Date();

  for (const [id, data] of vipUsers.entries()) {
    if (data.expires <= now) {
      try {
        await bot.banChatMember(GROUP_ID, id);
        await bot.unbanChatMember(GROUP_ID, id);
        vipUsers.delete(id);
        console.log("❌ VIP removido:", id);
      } catch {}
    }
  }
}
