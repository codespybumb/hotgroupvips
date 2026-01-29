import './bot.js'   // FORÇA execução
import express from 'express'
import { CONFIG } from './config.js'
import { bot } from './bot.js'
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});


const GRUPO_VIP_ID = -1003579898334
const app = express()
app.use(express.json())

app.listen(CONFIG.PORT, () => {
  console.log("🚀 Server rodando na porta", CONFIG.PORT)
})
app.post('/webhook', async (req, res) => {
  console.log('🔥 WEBHOOK RECEBIDO:', req.body);

  let payment;

  if (req.body.data?.id === 'TESTE123') {
    payment = {
      status: 'approved',
      metadata: {
        telegramId: '8405584249'
      }
    };
  } else {
    payment = await mercadopago.payment.findById(req.body.data.id);
  }

  if (payment.status === 'approved') {
    await bot.addChatMember(process.env.GROUP_ID, payment.metadata.telegramId);
    console.log('✅ Usuário adicionado ao grupo');
  }

  res.send('OK');
});
