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
  try {
    console.log('🔥 WEBHOOK RECEBIDO:', req.body);

    let payment;

    // 🔵 MODO TESTE (SEM MP)
    if (process.env.NODE_ENV === 'test') {
      payment = {
        status: 'approved',
        metadata: {
          telegramId: '8405584249'
        }
      };

      console.log('🧪 PAGAMENTO SIMULADO');
    } else {
      const paymentId = req.body?.data?.id;
      if (!paymentId) return res.sendStatus(200);

      payment = await mercadopago.payment.findById(paymentId);
      payment = payment.body;
    }

    if (payment.status === 'approved') {
      console.log('✅ PAGAMENTO APROVADO');

      await bot.sendMessage(
        payment.metadata.telegramId,
        '🎉 Pagamento aprovado! Você já está no VIP.'
      );

      // ⚠️ AQUI NÃO SE USA addChatMember (isso NÃO EXISTE)
      // O certo é gerar link de convite (te explico já)
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Erro no webhook:', err);
    res.sendStatus(500);
  }
});
