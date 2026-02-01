import express from "express"
import bot from "./bot.js"
import prisma from "./prisma.js"

const app = express()
app.use(express.json())

app.get("/", (_, res) => {
  res.send("OK")
})

app.post("/webhook", async (req, res) => {
  try {
    console.log("🔥 WEBHOOK:", JSON.stringify(req.body))

    const preapprovalId = req.body?.data?.id
    if (!preapprovalId) return res.sendStatus(200)

    const { getPreapproval } = await import("./mp.js")
    const assinatura = await getPreapproval(preapprovalId)
    if (!assinatura) return res.sendStatus(200)

    if (assinatura.status !== "authorized") {
      console.log("⏳ Status ignorado:", assinatura.status)
      return res.sendStatus(200)
    }

    const telegramId = assinatura.external_reference
    if (!telegramId) return res.sendStatus(200)

    const expira = new Date()
    expira.setDate(expira.getDate() + 30)

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
    res.sendStatus(200)

  } catch (err) {
    console.error("❌ WEBHOOK ERRO:", err)
    res.sendStatus(500)
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT)
})
