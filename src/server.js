import express from "express"
import { MercadoPagoConfig, PreApproval } from "mercadopago"
import prisma from "./prisma.js"
import bot from "./bot.js"
import { removeExpiredUsers } from "./jobs/removeExpired.js"
import {
  PORT,
  MP_ACCESS_TOKEN,
  VIP_DAYS,
  GROUP_ID
} from "./config.js"

console.log("🚀 SERVER.JS CARREGADO")

const app = express()
app.use(express.json())

const mpClient = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN
})

const preapproval = new PreApproval(mpClient)

app.post("/webhook", async (req, res) => {
  try {
    console.log("🔥 WEBHOOK:", req.body)

    const id = req.body?.data?.id
    if (!id) return res.sendStatus(200)

    const assinatura = await preapproval.get({ id })

    if (assinatura.status !== "authorized") {
      return res.sendStatus(200)
    }

    const telegramId = assinatura.external_reference
    if (!telegramId) return res.sendStatus(200)

    const expira = new Date()
    expira.setDate(expira.getDate() + VIP_DAYS)

    await prisma.assinatura.upsert({
      where: { telegramId },
      update: { expiraEm: expira },
      create: { telegramId, expiraEm: expira }
    })

    const invite = await bot.createChatInviteLink(GROUP_ID, {
      member_limit: 1
    })

    await bot.sendMessage(
      telegramId,
      `✅ Assinatura ativa!\nEntre no grupo:\n${invite.invite_link}`
    )

    console.log("✅ VIP liberado:", telegramId)

    res.sendStatus(200)

  } catch (err) {
    console.error("Webhook erro:", err)
    res.sendStatus(500)
  }
})

app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT)

  setInterval(removeExpiredUsers, 60 * 1000)
})
