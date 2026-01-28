import express from 'express'
import { bot, prisma } from './bot.js'
import { CONFIG } from './config.js'

const app = express()
app.use(express.json())

app.post('/webhook', async (req, res) => {
  const data = req.body

  if (data.type === 'payment') {
    const tgId = BigInt(data.data.metadata.telegramId)
    const expires = new Date(Date.now() + CONFIG.DIAS_VIP * 86400000)

    await prisma.vipUser.upsert({
      where: { telegramId: tgId },
      update: { expiresAt: expires, isActive: true },
      create: { telegramId: tgId, expiresAt: expires }
    })

    await bot.sendMessage(CONFIG.GROUP_ID, '✅ Novo VIP ativado!')
  }
  res.sendStatus(200)
})

app.listen(CONFIG.PORT, () =>
  console.log('Server rodando'))
