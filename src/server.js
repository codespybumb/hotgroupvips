import express from "express"
import bot from "./bot.js"
import prisma from "./prisma.js"
import { removeExpiredUsers } from "./jobs/removeExpired.js"

console.log("🚀 SERVER.JS CARREGADO")

const app = express()
app.use(express.json())

// =====================
// WEBHOOK MERCADO PAGO
// =====================

app.post("/webhook", async (req, res) => {
  try {
    console.log("🔥 WEBHOOK RECEBIDO:", req.body)

    const preapprovalId = req.body?.data?.id
    if (!preapprovalId) return res.sendStatus(200)

    const { getPreapproval } = await import("./mp.js")
    const assinatura = await getPreapproval(preapprovalId)

    if (!assinatura) return res.sendStatus(200)
    if (assinatura.status !== "authorized") return res.sendStatus(200)

    const telegramId = assinatura.external_reference
    if (!telegramId) return res.sendStatus(200)

    const expira = new Date()
    expira.setDate(expira.getDate() + Number(process.env.VIP_DAYS || 30))

    await prisma.assinatura.upsert({
      where: { telegramId },
      update: { expiraEm: expira },
      create: { telegramId, expiraEm: expira }
    })

    const invite = await bot.createChatInviteLink(
      process.env.GROUP_ID,
      { member_limit: 1 }
    )

    await bot.sendMessage(
      telegramId,
      `✅ Assinatura ativa!\n\nEntre no VIP:\n${invite.invite_link}`
    )

    console.log("✅ VIP LIBERADO:", telegramId)

    return res.sendStatus(200)

  } catch (err) {
    console.error("❌ WEBHOOK ERRO (IGNORADO):", err)
    return res.sendStatus(200) // ⚠️ NUNCA 500
  }
})

