import prisma from "../prisma.js";
import bot from "../bot.js";

export async function removeExpiredUsers() {
  console.log("⏱ Verificando usuários expirados...");

  const expiredUsers = await prisma.user.findMany({
    where: {
      status: "active",
      expiresAt: {
        lt: new Date()
      }
    }
  });

  console.log("👥 Encontrados:", expiredUsers.length);

  for (const user of expiredUsers) {
    try {
      await bot.banChatMember(
        process.env.GROUP_ID,
        Number(user.telegramId)
      );

      await bot.unbanChatMember(
        process.env.GROUP_ID,
        Number(user.telegramId)
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { status: "expired" }
      });

      console.log("🚫 Removido:", user.telegramId);
    } catch (err) {
      console.log("⚠️ Erro remover:", err.message);
    }
  }
}
