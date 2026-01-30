import express from "express"
import { CONFIG } from "./config.js"

console.log("🚀 SERVER.JS CARREGADO")

const app = express()
app.use(express.json())

// healthcheck
app.get("/", (_, res) => {
  res.send("OK")
})

// webhook placeholder
app.post("/webhook", (req, res) => {
  console.log("Webhook recebido:", req.body)
  res.sendStatus(200)
})

app.listen(CONFIG.PORT, () => {
  console.log("🚀 Server rodando na porta", CONFIG.PORT)
})
