import prisma from "../prisma.js"
import bot from "../bot.js"
import { CONFIG } from "./config.js"

export async function removeExpiredUsers() {
  try {
    const agora = new Date()

    const expirados = await prisma.assinatura.findMany({
      where: {
        expiraEm: { lt: agora }
      }
    })

    for (const user of expirados) {
      try {
        await bot.banChatMember(GROUP_ID, Number(user.telegramId))
        await bot.unbanChatMember(GROUP_ID, Number(user.telegramId))

        console.log("🚫 Removido:", user.telegramId)

        await prisma.assinatura.delete({
          where: { telegramId: user.telegramId }
        })

      } catch (e) {
        console.log("⚠️ Falha remover:", user.telegramId)
      }
    }

  } catch (err) {
    console.error("Erro removeExpired:", err)
  }
}
