import pkg from "mercadopago"
import { CONFIG } from "./config.js"

const { MercadoPagoConfig, PreApproval } = pkg

const client = new MercadoPagoConfig({
  accessToken: CONFIG.MP_ACCESS_TOKEN
})

const preapproval = new PreApproval(client)

app.post("/webhook", async (req, res) => {
  try {
    const id = req.body.data.id

    const sub = await preapproval.get({ id })

    if (sub.status !== "authorized") {
      return res.sendStatus(200)
    }

    const telegramId = sub.external_reference

    // liberar VIP aqui

    res.sendStatus(200)

  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})
