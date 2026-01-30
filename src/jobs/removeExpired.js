import bot from "../bot.js"
import { GROUP_ID } from "../config.js"

export async function removeExpiredUsers() {
  const expirados = await prisma.subscription.findMany({
    where: { expiresAt: { lt: new Date() } }
  })

  for (const sub of expirados) {
    try {
      await bot.banChatMember(GROUP_ID, sub.userId)
      await bot.unbanChatMember(GROUP_ID, sub.userId)

      await prisma.subscription.delete({ where: { id: sub.id } })

      console.log("❌ Removido:", sub.userId)
    } catch (err) {
      console.error("Erro ao remover:", err)
    }
  }
}
