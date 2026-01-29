import prisma from "../prisma.js";
import bot from "../bot.js";

export async function removeExpiredUsers() {
  console.log("⏱ Verificando usuários expirados...");

  const expirados = await prisma.assinatura.findMany({
    where: {
      expiraEm: {
        lt: new Date()
      }
    }
  });

  for (const user of expirados) {
    try {
      await bot.banChatMember(process.env.GROUP_ID, Number(user.telegramId));
      await bot.unbanChatMember(process.env.GROUP_ID, Number(user.telegramId));

      await prisma.assinatura.delete({
        where: { telegramId: user.telegramId }
      });

      console.log("🚫 Removido:", user.telegramId);

    } catch (err) {
      console.log("⚠️ erro ao remover:", user.telegramId);
    }
  }
}
