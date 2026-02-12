import express from "express"
import bot from "./bot.js"
import prisma from "./prisma.js"

const app = express()
app.use(express.json())

// =============================
// GARANTIR TABELA
// =============================
async function garantirTabela() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Assinatura" (
      id SERIAL PRIMARY KEY,
      "telegramId" TEXT UNIQUE NOT NULL,
      "plano" TEXT DEFAULT 'mensal',
      "expiraEm" TIMESTAMP,
      "createdAt" TIMESTAMP DEFAULT NOW()
    );
  `)

  console.log("✅ Tabela Assinatura verificada/criada")
}

garantirTabela()

app.get("/", (_, res) => {
  res.send("OK")
})

app.post("/webhook", async (req, res) => {
  try {
    console.log("🔥 WEBHOOK:", JSON.stringify(req.body))

    const tipo = req.body?.type
    const id = req.body?.data?.id
    if (!id) return res.sendStatus(200)

    // =============================
    // 🔵 ASSINATURA MENSAL
    // =============================
    if (tipo === "subscription_preapproval") {

      const { getPreapproval } = await import("./mp.js")
      const assinatura = await getPreapproval(id)
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
        update: {
          plano: "mensal",
          expiraEm: expira
        },
        create: {
          telegramId,
          plano: "mensal",
          expiraEm: expira
        }
      })

      await liberarAcesso(telegramId)

      console.log("✅ MENSAL LIBERADO:", telegramId)
      return res.sendStatus(200)
    }

    // =============================
    // 🟢 PAGAMENTO ÚNICO
    // =============================
    if (tipo === "payment") {

      const { getPayment } = await import("./mp.js")
      const payment = await getPayment(id)
      if (!payment) return res.sendStatus(200)

      if (payment.status !== "approved") {
        console.log("⏳ Pagamento não aprovado:", payment.status)
        return res.sendStatus(200)
      }

      const telegramId = payment.external_reference
      if (!telegramId) return res.sendStatus(200)

      const titulo = payment.additional_info?.items?.[0]?.title

      // 6 MESES
      if (titulo === "VIP 6 Meses") {

        const expira = new Date()
        expira.setDate(expira.getDate() + 180)

        await prisma.assinatura.upsert({
          where: { telegramId },
          update: {
            plano: "semestral",
            expiraEm: expira
          },
          create: {
            telegramId,
            plano: "semestral",
            expiraEm: expira
          }
        })

        await liberarAcesso(telegramId)
        console.log("✅ 6 MESES LIBERADO:", telegramId)
      }

      // VITALÍCIO
      if (titulo === "VIP Vitalício") {

        await prisma.assinatura.upsert({
          where: { telegramId },
          update: {
            plano: "vitalicio",
            expiraEm: null
          },
          create: {
            telegramId,
            plano: "vitalicio",
            expiraEm: null
          }
        })

        await liberarAcesso(telegramId)
        console.log("✅ VITALÍCIO LIBERADO:", telegramId)
      }

      return res.sendStatus(200)
    }

    return res.sendStatus(200)

  } catch (err) {
    console.error("❌ WEBHOOK ERRO:", err)
    return res.sendStatus(500)
  }
})

// =============================
// LIBERAR ACESSO
// =============================
async function liberarAcesso(telegramId) {

  const invite = await bot.createChatInviteLink(
    process.env.GROUP_ID,
    { member_limit: 1 }
  )

  await bot.sendMessage(
    telegramId,
    `✅ Pagamento confirmado!\n\nEntre no VIP:\n${invite.invite_link}`
  )
}

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT)
})
