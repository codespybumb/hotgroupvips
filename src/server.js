import express from "express"
import pkg from "mercadopago"

import { CONFIG } from "./config.js"
import prisma from "./prisma.js"
import bot from "./bot.js"
import { removeExpiredUsers } from "./jobs/removeExpired.js"

console.log("🚀 SERVER.JS CARREGADO")

// =======================
// MERCADO PAGO SDK V2
// =======================

const { MercadoPagoConfig, PreApproval } = pkg

const mpClient = new MercadoPagoConfig({
  accessToken: CONFIG.MP_ACCESS_TOKEN
})

const preapproval = new PreApproval(mpClient)

// =======================
// EXPRESS
// =======================

const app = express()
app.use(express.json())

// =======================
// HEALTH CHECK
// =======================

app.get("/", (req, res) => {
  res.send("✅ Bot VIP rodando")
})

// =======================
// WEBHOOK MERCADO PAGO
// =======================

app.post("/webhook", async (req, res) => {
  try {
    console.log("📩 Webhook recebido:", JSON.stringify(req.body))

    const id = req.body?.data?.id
    const type = req.body?.type

    if (!id || type !== "preapproval") {
      return res.sendStatus(200)
    }

    const assinatura = await preapproval.get({ id })

    console.log("📄 Assinatura:", assinatura.status)

    // só libera se autorizado
    if (assinatura.status !== "authorized") {
      return res.sendStatus(200)
    }

    const telegramId = assinatura.external_reference

    if (!telegramId) {
      console.log("⚠️ Sem telegramId")
      return res.sendStatus(200)
    }

    // =======================
    // SALVAR NO BANCO
    // =======================

    const expira = new Date()
    expira.setDate(expira.getDate() + CONFIG.DIAS_VIP)

    await prisma.assinatura.upsert({
      where: { telegramId: telegramId.toString() },
      update: { expiraEm: expira },
      create: {
        telegramId: telegramId.toString(),
        expiraEm: expira
      }
    })

    console.log("📅 VIP salvo até:", expira)

    // =======================
    // CRIAR LINK ÚNICO
    // =======================

    const invite = await bot.createChatInviteLink(
      CONFIG.GROUP_ID,
      { member_limit: 1 }
    )

    await bot.sendMessage(
      telegramId,
      `✅ Assinatura aprovada!\n\nEntre no grupo VIP:\n${invite.invite_link}`
    )

    console.log("🔗 Link enviado")

    res.sendStatus(200)

  } catch (err) {
    console.error("❌ Erro webhook:", err)
    res.sendStatus(500)
  }
})

// =======================
// START SERVER
// =======================

app.listen(CONFIG.PORT, () => {
  console.log(`🚀 Server rodando na porta ${CONFIG.PORT}`)

  // remover expirados a cada 10 minutos
  setInterval(removeExpiredUsers, 10 * 60 * 1000)
})
