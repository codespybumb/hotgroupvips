import './bot.js'   // FORÇA execução
import express from 'express'
import { CONFIG } from './config.js'

const app = express()
app.use(express.json())

app.listen(CONFIG.PORT, () => {
  console.log("🚀 Server rodando na porta", CONFIG.PORT)
})
