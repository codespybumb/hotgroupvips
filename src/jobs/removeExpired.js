import prisma from "../prisma.js"
import bot from "../bot.js"
import { CONFIG } from "../config.js"

export async function removeExpiredUsers() {

  const agora = new Date()

  const expirados = await prisma.assinatura.findMany({
    where: {
      expiraEm: { lt: agora }
    }
  })

  for (const user of expirados) {

    await bot.banChatMember(CONFIG.GROUP_ID, Number(user.telegramId))
    await bot.unbanChatMember(CONFIG.GROUP_ID, Number(user.telegramId))

    await prisma.assinatura.delete({
      where: { telegramId: user.telegramId }
    })

    console.log("🚫 Removido:", user.telegramId)
  }
}
