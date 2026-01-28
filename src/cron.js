import cron from 'node-cron'
import { prisma, bot } from './bot.js'
import { CONFIG } from './config.js'

cron.schedule('0 * * * *', async () => {
  const expirados = await prisma.vipUser.findMany({
    where: { expiresAt: { lt: new Date() }, isActive: true }
  })

  for (const u of expirados) {
    await bot.banChatMember(CONFIG.GROUP_ID, Number(u.telegramId))
    await prisma.vipUser.update({
      where: { id: u.id },
      data: { isActive: false }
    })
  }
})
