import prisma from "./prisma.js";
import bot from "./bot.js";

console.log("⏱ CRON ATIVO");

setInterval(async () => {
  const agora = new Date();

  const vencidos = await prisma.assinatura.findMany({
    where: {
      expiraEm: {
        lt: agora
      }
    }
  });

  for (const user of vencidos) {
    try {
      await bot.banChatMember(
        process.env.GROUP_ID,
        user.telegramId
      );

      await prisma.assinatura.delete({
        where: { telegramId: user.telegramId }
      });

      console.log("🚫 removido:", user.telegramId);
    } catch (err) {
      console.log("erro remover:", err.message);
    }
  }

}, 1000 * 60 * 60);
